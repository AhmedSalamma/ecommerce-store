<?php

use App\Http\Controllers\Api\v1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\v1\Customer\CartController;
use App\Http\Controllers\Api\v1\Customer\OrderController;
use App\Http\Controllers\Api\v1\Customer\ProductController;
use App\Http\Controllers\Api\v1\Customer\SearchController;
use Illuminate\Support\Facades\Route;


Route::post('register', RegisterController::class);
Route::post('login', LoginController::class);
Route::post('logout', LogoutController::class)->middleware('auth:sanctum');;



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/filter', [SearchController::class, 'filter']);

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::Post('/store', [ProductController::class, 'store']);
        Route::get('/{product}', [ProductController::class, 'show']);
        Route::post('update/{product}', [ProductController::class, 'update']);
        Route::post('destroy/{product}', [ProductController::class, 'destroy']);

    });

    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/{product}', [CartController::class, 'store']);
        Route::patch('/{cartItem}', [CartController::class, 'update']);
        Route::delete('/{cartItem}', [CartController::class, 'delete']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/make', [OrderController::class, 'store']);

    });

});