<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ambulance;
use App\Models\ContactRequest;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AmbulanceController extends Controller
{
    /**
     * Display a listing of ambulances with optional filters.
     */
    public function index(Request $request)
    {
        $query = Ambulance::with('provider');

        // Filter by status if provided
        if ($request->has('status') && in_array($request->status, ['tersedia', 'sedang_bertugas', 'offline'])) {
            $query->where('status', $request->status);
        }

        // Filter by vehicle type
        if ($request->has('type')) {
            $query->where('vehicle_type', $request->type);
        }

        $hasCoords = $request->has(['lat', 'lng']) && is_numeric($request->lat) && is_numeric($request->lng);

        if ($hasCoords) {
            $lat = (float) $request->lat;
            $lng = (float) $request->lng;
            $query->nearestTo($lat, $lng);
        } else {
            $query->orderBy('name', 'asc');
        }

        $ambulances = $query->get()->map(function ($item) use ($request, $hasCoords) {
            if ($hasCoords) {
                $userLat = (float) $request->lat;
                $userLng = (float) $request->lng;
                $ambLat = (float) $item->latitude;
                $ambLng = (float) $item->longitude;

                if (!isset($item->distance) && $ambLat && $ambLng) {
                    $earthRadius = 6371; // km
                    $dLat = deg2rad($ambLat - $userLat);
                    $dLon = deg2rad($ambLng - $userLng);
                    $a = sin($dLat / 2) * sin($dLat / 2) +
                         cos(deg2rad($userLat)) * cos(deg2rad($ambLat)) *
                         sin($dLon / 2) * sin($dLon / 2);
                    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
                    $item->distance = round($earthRadius * $c, 1);
                }
            }

            // Calculate simulated duration if distance exists
            if (isset($item->distance)) {
                $item->distance_km = round($item->distance, 1);
                // Palembang traffic average: ~25 km/h + 3 minutes base dispatch time
                $item->estimated_minutes = max(3, (int) round(($item->distance_km / 25) * 60 + 3));
            }
            return $item;
        });

        if ($hasCoords) {
            $statusOrder = ['tersedia' => 1, 'sedang_bertugas' => 2, 'offline' => 3];
            $ambulances = $ambulances->sort(function ($a, $b) use ($statusOrder) {
                $orderA = $statusOrder[$a->status] ?? 99;
                $orderB = $statusOrder[$b->status] ?? 99;
                if ($orderA !== $orderB) {
                    return $orderA - $orderB;
                }
                return ($a->distance_km ?? 999) <=> ($b->distance_km ?? 999);
            })->values();
        }

        return response()->json([
            'success' => true,
            'count' => $ambulances->count(),
            'data' => $ambulances,
        ]);
    }

    /**
     * Display the specified ambulance.
     */
    public function show($id)
    {
        $ambulance = Ambulance::with('provider')->find($id);

        if (!$ambulance) {
            return response()->json([
                'success' => false,
                'message' => 'Ambulans tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ambulance,
        ]);
    }

    /**
     * Get providers and their ambulance count.
     */
    public function providers()
    {
        $providers = Provider::withCount(['ambulances', 'ambulances as available_ambulances_count' => function ($q) {
            $q->where('status', 'tersedia');
        }])->active()->get();

        return response()->json([
            'success' => true,
            'data' => $providers,
        ]);
    }

    /**
     * General stats for dashboard / trust row.
     */
    public function stats()
    {
        $totalAmbulances = Ambulance::count();
        $availableAmbulances = Ambulance::where('status', 'tersedia')->count();
        $onDutyAmbulances = Ambulance::where('status', 'sedang_bertugas')->count();
        $offlineAmbulances = Ambulance::where('status', 'offline')->count();
        $totalProviders = Provider::count();

        return response()->json([
            'success' => true,
            'data' => [
                'city' => 'Palembang',
                'region' => 'Seberang Ilir & Ulu',
                'total_ambulances' => $totalAmbulances,
                'available_ambulances' => $availableAmbulances,
                'on_duty_ambulances' => $onDutyAmbulances,
                'offline_ambulances' => $offlineAmbulances,
                'total_providers' => $totalProviders,
                'emergency_hotlines' => ['112', '119'],
            ],
        ]);
    }

    /**
     * Log contact request when user clicks WhatsApp / Hubungi Admin.
     */
    public function logContact(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ambulance_id' => 'required|exists:ambulances,id',
            'user_name' => 'nullable|string|max:255',
            'user_phone' => 'nullable|string|max:50',
            'user_latitude' => 'nullable|numeric',
            'user_longitude' => 'nullable|numeric',
            'user_address' => 'nullable|string|max:255',
            'patient_condition' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $log = ContactRequest::create([
            'ambulance_id' => $request->ambulance_id,
            'user_name' => $request->user_name ?? 'Warga (Portal Publik)',
            'user_phone' => $request->user_phone ?? '-',
            'user_latitude' => $request->user_latitude,
            'user_longitude' => $request->user_longitude,
            'user_address' => $request->user_address,
            'patient_condition' => $request->patient_condition ?? 'Memerlukan penjemputan darurat segera',
            'status' => 'menunggu',
            'contacted_via' => 'whatsapp',
            'ip_address' => $request->ip(),
        ]);

        $log->load('ambulance.provider');

        return response()->json([
            'success' => true,
            'message' => 'Permintaan ambulans berhasil dicatat',
            'data' => $log,
        ], 201);
    }

    /**
     * Store a newly created ambulance.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'unit_code' => 'required|string|max:50|unique:ambulances,unit_code',
            'provider_id' => 'required|exists:providers,id',
            'status' => 'required|in:tersedia,sedang_bertugas,offline',
            'vehicle_type' => 'nullable|string',
            'has_oxygen' => 'boolean',
            'has_icu' => 'boolean',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'base_location' => 'required|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:50',
            'whatsapp_number' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $ambulance = Ambulance::create($validator->validated());
        $ambulance->load('provider');

        return response()->json([
            'success' => true,
            'message' => 'Unit ambulans berhasil ditambahkan',
            'data' => $ambulance,
        ], 201);
    }

    /**
     * Update the specified ambulance.
     */
    public function update(Request $request, $id)
    {
        $ambulance = Ambulance::find($id);

        if (!$ambulance) {
            return response()->json([
                'success' => false,
                'message' => 'Unit ambulans tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'unit_code' => 'sometimes|string|max:50|unique:ambulances,unit_code,' . $id,
            'provider_id' => 'sometimes|exists:providers,id',
            'status' => 'sometimes|in:tersedia,sedang_bertugas,offline',
            'vehicle_type' => 'nullable|string',
            'has_oxygen' => 'boolean',
            'has_icu' => 'boolean',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'base_location' => 'nullable|string|max:255',
            'driver_name' => 'nullable|string|max:255',
            'driver_phone' => 'nullable|string|max:50',
            'whatsapp_number' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $ambulance->update($validator->validated());
        $ambulance->load('provider');

        return response()->json([
            'success' => true,
            'message' => 'Unit ambulans berhasil diperbarui',
            'data' => $ambulance,
        ]);
    }

    /**
     * Remove the specified ambulance.
     */
    public function destroy($id)
    {
        $ambulance = Ambulance::find($id);

        if (!$ambulance) {
            return response()->json([
                'success' => false,
                'message' => 'Unit ambulans tidak ditemukan',
            ], 404);
        }

        $ambulance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit ambulans berhasil dihapus',
        ]);
    }

    /**
     * Get recent contact requests for admin dispatch monitor.
     */
    public function contactRequests(Request $request)
    {
        $query = ContactRequest::with('ambulance.provider');

        if ($request->has('status') && $request->status !== 'semua' && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('user_name', 'like', $s)
                  ->orWhere('user_phone', 'like', $s)
                  ->orWhere('user_address', 'like', $s)
                  ->orWhereHas('ambulance', function ($qa) use ($s) {
                      $qa->where('name', 'like', $s)
                         ->orWhere('unit_code', 'like', $s);
                  });
            });
        }

        $requests = $query->orderBy('created_at', 'desc')->limit(50)->get();

        return response()->json([
            'success' => true,
            'count' => $requests->count(),
            'data' => $requests,
        ]);
    }

    /**
     * Update status and notes of a contact/emergency request.
     */
    public function updateContactStatus(Request $request, $id)
    {
        $contact = ContactRequest::with('ambulance')->find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Data permintaan darurat tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:menunggu,dihubungi,ditangani,selesai,dibatalkan',
            'admin_notes' => 'nullable|string',
            'ambulance_id' => 'nullable|exists:ambulances,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $newStatus = $request->status;
        $oldAmbulanceId = $contact->ambulance_id;
        $newAmbulanceId = $request->has('ambulance_id') && !empty($request->ambulance_id)
            ? (int) $request->ambulance_id
            : $oldAmbulanceId;

        $contact->status = $newStatus;
        if ($request->has('admin_notes')) {
            $contact->admin_notes = $request->admin_notes;
        }
        if ($newAmbulanceId != $oldAmbulanceId) {
            $contact->ambulance_id = $newAmbulanceId;
        }
        $contact->save();

        // Automatic synchronization of ambulance fleet status
        // 1. If ambulance was reassigned, handle the old ambulance status
        if ($oldAmbulanceId && $oldAmbulanceId != $newAmbulanceId) {
            $oldOtherActive = ContactRequest::where('ambulance_id', $oldAmbulanceId)
                ->where('id', '!=', $contact->id)
                ->where('status', 'ditangani')
                ->exists();
            $oldAmbulance = Ambulance::find($oldAmbulanceId);
            if ($oldAmbulance && !$oldOtherActive && $oldAmbulance->status !== 'offline') {
                $oldAmbulance->update(['status' => 'tersedia']);
            }
        }

        // 2. Handle current/new ambulance status
        $targetAmbulance = Ambulance::find($newAmbulanceId);
        if ($targetAmbulance) {
            if ($newStatus === 'ditangani') {
                $targetAmbulance->update(['status' => 'sedang_bertugas']);
            } elseif (in_array($newStatus, ['selesai', 'dibatalkan'])) {
                // If no other active request is assigned to this ambulance, and ambulance is not offline, set back to tersedia
                $otherActive = ContactRequest::where('ambulance_id', $newAmbulanceId)
                    ->where('id', '!=', $contact->id)
                    ->where('status', 'ditangani')
                    ->exists();

                if (!$otherActive && $targetAmbulance->status !== 'offline') {
                    $targetAmbulance->update(['status' => 'tersedia']);
                }
            }
        }

        $contact->load('ambulance.provider');

        return response()->json([
            'success' => true,
            'message' => 'Status permintaan berhasil diperbarui',
            'data' => $contact,
        ]);
    }
}
