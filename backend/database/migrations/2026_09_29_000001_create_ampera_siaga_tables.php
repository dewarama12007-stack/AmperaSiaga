<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('rumah_sakit'); // rumah_sakit, pmi, swasta, puskesmas
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('whatsapp_admin');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('ambulances', function (Blueprint $table) {
            $table->id();
            $table->string('unit_code')->unique();
            $table->string('name');
            $table->foreignId('provider_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['tersedia', 'sedang_bertugas', 'offline'])->default('tersedia');
            $table->string('vehicle_type')->default('standar'); // standar, icu_mobile, transport
            $table->boolean('has_oxygen')->default(false);
            $table->boolean('has_icu')->default(false);
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('base_location');
            $table->string('driver_name')->nullable();
            $table->string('driver_phone')->nullable();
            $table->string('whatsapp_number');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ambulance_id')->constrained()->onDelete('cascade');
            $table->decimal('user_latitude', 10, 8)->nullable();
            $table->decimal('user_longitude', 11, 8)->nullable();
            $table->string('user_address')->nullable();
            $table->text('patient_condition')->nullable();
            $table->string('contacted_via')->default('whatsapp');
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
        Schema::dropIfExists('ambulances');
        Schema::dropIfExists('providers');
    }
};
