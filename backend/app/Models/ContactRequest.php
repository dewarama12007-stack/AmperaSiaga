<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    protected $fillable = [
        'ambulance_id',
        'user_name',
        'user_phone',
        'user_latitude',
        'user_longitude',
        'user_address',
        'patient_condition',
        'status',
        'admin_notes',
        'contacted_via',
        'ip_address',
    ];

    protected $casts = [
        'user_latitude' => 'decimal:8',
        'user_longitude' => 'decimal:8',
    ];

    /**
     * Get the ambulance associated with this contact request.
     */
    public function ambulance()
    {
        return $this->belongsTo(Ambulance::class);
    }
}
