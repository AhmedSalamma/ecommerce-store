<?php

use App\Exceptions\Checkout\AddressNotFoundException;
use App\Exceptions\Checkout\CartIsEmptyException;
use App\Exceptions\Checkout\CheckoutInProgressException;
use App\Exceptions\Checkout\OutOfStockException;
use App\Exceptions\Checkout\ShippingPriceNotFoundException;
use App\Exceptions\PaymentFailedException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (CartIsEmptyException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        });

        $exceptions->render(function (AddressNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);
        });

        $exceptions->render(function (ShippingPriceNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        });

        $exceptions->render(function (OutOfStockException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 409);
        });

        $exceptions->render(function (CheckoutInProgressException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 409);
        });

        $exceptions->render(function (PaymentFailedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        });

    })
    ->create();
