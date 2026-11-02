<?php

use App\Http\Controllers\Api\AmbulanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\ApiTokenAuth;
use Illuminate\Support\Facades\Route;

// ==========================================
// Public Citizen Endpoints
// ==========================================
Route::get('/ambulances', [AmbulanceController::class, 'index']);
Route::get('/ambulances/{id}', [AmbulanceController::class, 'show']);
Route::get('/providers', [AmbulanceController::class, 'providers']);
Route::get('/stats', [AmbulanceController::class, 'stats']);
Route::middleware('throttle:30,1')->post('/contact-request', [AmbulanceController::class, 'logContact']);

// ==========================================
// Admin Authentication (Rate-limited against brute-force in production)
// ==========================================
Route::middleware('throttle:10,1')->post('/auth/login', [AuthController::class, 'login']);

// ==========================================
// Protected Admin Dispatch & Fleet Routes
// ==========================================
Route::middleware([ApiTokenAuth::class])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'updatePassword']);

    // Fleet Management CRUD
    Route::post('/ambulances', [AmbulanceController::class, 'store']);
    Route::put('/ambulances/{id}', [AmbulanceController::class, 'update']);
    Route::delete('/ambulances/{id}', [AmbulanceController::class, 'destroy']);

    // Dispatch Monitor & Request Handling
    Route::get('/contact-requests', [AmbulanceController::class, 'contactRequests']);
    Route::patch('/contact-requests/{id}/status', [AmbulanceController::class, 'updateContactStatus']);
});

// Fallback public GET for contact-requests during demo or transitional state if needed (read-only)
Route::get('/public/contact-requests', [AmbulanceController::class, 'contactRequests']);

