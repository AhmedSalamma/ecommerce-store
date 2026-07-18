<?php

use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Customer\AddressController;
use App\Http\Controllers\Api\V1\Customer\BrandController;
use App\Http\Controllers\Api\V1\Customer\CartController;
use App\Http\Controllers\Api\V1\Customer\CategoryController;
use App\Http\Controllers\Api\V1\Customer\CheckoutController;
use App\Http\Controllers\Api\V1\Customer\OrderController;
use App\Http\Controllers\Api\V1\Customer\ProductController;
use App\Http\Controllers\Api\V1\Customer\SearchController;
use App\Http\Controllers\Api\V1\Customer\ShippingPriceController;
use App\Http\Controllers\Api\V1\Webhooks\StripeWebhookController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', RegisterController::class);
Route::post('login', LoginController::class);
Route::post('logout', LogoutController::class)->middleware('auth:sanctum');

Route::post('webhooks/stripe', [StripeWebhookController::class, 'handle'])->name('webhooks.stripe');

Route::get('/filter', [SearchController::class, 'filter']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/shipping-prices', [ShippingPriceController::class, 'index']);

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{product}', [ProductController::class, 'show']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn (Request $request) => response()->json([
        'data' => UserResource::make($request->user()),
    ]));

    Route::prefix('products')->group(function () {
        Route::Post('/store', [ProductController::class, 'store']);
        Route::post('update/{product}', [ProductController::class, 'update']);
        Route::post('destroy/{product}', [ProductController::class, 'destroy']);

    });

    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/{product}', [CartController::class, 'store']);
        Route::patch('/{cartItem}', [CartController::class, 'update']);
        Route::delete('/{cartItem}', [CartController::class, 'delete']);
    });

    Route::prefix('addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::delete('/{address}', [AddressController::class, 'destroy']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/{order}', [OrderController::class, 'show']);
        Route::post('/{order}/cancel', [OrderController::class, 'cancel']);
    });

    Route::prefix('checkout')->group(function () {
        Route::post('/', [CheckoutController::class, 'checkout']);
        Route::get('/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');
        Route::get('/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    });

});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminDashboardController::class, 'stats']);

    Route::prefix('products')->group(function () {
        Route::get('/', [AdminProductController::class, 'index']);
        Route::get('/{product}', [AdminProductController::class, 'show']);
        Route::post('/store', [AdminProductController::class, 'store']);
        Route::post('/update/{product}', [AdminProductController::class, 'update']);
        Route::post('/destroy/{product}', [AdminProductController::class, 'destroy']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [AdminCategoryController::class, 'index']);
        Route::post('/store', [AdminCategoryController::class, 'store']);
        Route::post('/update/{category}', [AdminCategoryController::class, 'update']);
        Route::post('/destroy/{category}', [AdminCategoryController::class, 'destroy']);
    });

    Route::apiResource('users', AdminUserController::class)->except(['show']);
});
