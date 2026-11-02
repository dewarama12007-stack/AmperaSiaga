<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'phone',
        'whatsapp_admin',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the ambulances for the provider.
     */
    public function ambulances()
    {
        return $this->hasMany(Ambulance::class);
    }

    /**
     * Scope: only active providers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
