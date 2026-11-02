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
        Schema::table('contact_requests', function (Blueprint $table) {
            $table->string('user_name')->nullable()->after('ambulance_id');
            $table->string('user_phone')->nullable()->after('user_name');
            $table->string('status')->default('menunggu')->after('patient_condition'); // menunggu, dihubungi, ditangani, selesai, dibatalkan
            $table->text('admin_notes')->nullable()->after('status');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token', 80)->unique()->nullable()->default(null)->after('password');
            $table->string('role')->default('admin')->after('api_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_requests', function (Blueprint $table) {
            $table->dropColumn(['user_name', 'user_phone', 'status', 'admin_notes']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['api_token', 'role']);
        });
    }
};
