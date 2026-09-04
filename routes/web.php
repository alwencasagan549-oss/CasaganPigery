<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\PigController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BreedingRecordController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\FeedStockController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;

Route::group([], function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    // Public API routes
    Route::get('/pigs', [PigController::class, 'index']);
    Route::post('/inquiries', [InquiryController::class, 'store']);

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
        Route::get('/reports-data', [ReportController::class, 'index']);
        
        // Admin resource routes
        Route::resource('pigs', PigController::class)->except(['index']);
        Route::resource('inquiries', InquiryController::class)->except(['store']);
        Route::resource('breeding-records', BreedingRecordController::class);
        Route::resource('health-records', HealthRecordController::class);
        Route::resource('feed-stocks', FeedStockController::class);
        Route::resource('customers', CustomerController::class);
        Route::resource('sales', SaleController::class);
        Route::resource('users', UserController::class);
    });
});

Route::get('/db-test', function() {
    try {
        \DB::connection()->getPdo();
        return "Database is connected successfully!";
    } catch (\Exception $e) {
        return "Database Error: " . $e->getMessage();
    }
});

Route::get('/pig-count', function() {
    return "Total Pigs in Database: " . \App\Models\Pig::count();
});

Route::get('/', function () {
    return view('app');
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
