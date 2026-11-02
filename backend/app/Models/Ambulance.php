<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambulance extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_code',
        'name',
        'provider_id',
        'status',
        'vehicle_type',
        'has_oxygen',
        'has_icu',
        'latitude',
        'longitude',
        'base_location',
        'driver_name',
        'driver_phone',
        'whatsapp_number',
        'description',
    ];

    protected $casts = [
        'has_oxygen' => 'boolean',
        'has_icu' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Status constants
     */
    const STATUS_AVAILABLE = 'tersedia';
    const STATUS_ON_DUTY = 'sedang_bertugas';
    const STATUS_OFFLINE = 'offline';

    /**
     * Get the provider that owns the ambulance.
     */
    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * Scope: only available ambulances
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }

    /**
     * Scope: order by distance from a given point using Haversine formula
     */
    public function scopeNearestTo($query, float $lat, float $lng)
    {
        $driver = $query->getConnection()->getDriverName();
        if ($driver === 'sqlite') {
            // SQLite lacks native trigonometric functions; distance calculated in collection
            return $query;
        }

        $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))";

        return $query->selectRaw("*, {$haversine} AS distance", [$lat, $lng, $lat])
                     ->orderBy('distance');
    }
}
