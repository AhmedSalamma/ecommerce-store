<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Services\Payment\Contracts\PaymentInterface;
use Stripe\Checkout\Session;
use Stripe\StripeClient;

class StripePaymentService implements PaymentInterface
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    public function pay(Order $order): Session
    {
        $currency = config('services.stripe.currency', 'usd');

        $items = $order->items->map(fn ($item) => [
            'price_data' => [
                'currency' => $currency,
                'product_data' => [
                    'name' => $item->product->title,
                    'description' => $item->product->description,
                ],
                'unit_amount' => (int) round($item->price * 100),
            ],
            'quantity' => $item->quantity,
        ])->toArray();

        if ($order->shipping_cost > 0) {
            $items[] = [
                'price_data' => [
                    'currency' => $currency,
                    'product_data' => [
                        'name' => 'Shipping',
                    ],
                    'unit_amount' => (int) round($order->shipping_cost * 100),
                ],
                'quantity' => 1,
            ];
        }

        $frontendUrl = rtrim(config('services.frontend_url'), '/');

        return $this->stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => $items,
            'mode' => 'payment',
            'client_reference_id' => $order->order_number,
            'metadata' => [
                'order_id' => $order->id,
            ],
            'success_url' => $frontendUrl.'/checkout/success?order_id='.$order->id.'&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontendUrl.'/checkout/cancel?order_id='.$order->id,
        ], [
            'idempotency_key' => 'checkout-session-'.$order->order_number,
        ]);
    }

    public function retrieveSession(string $sessionId): Session
    {
        return $this->stripe->checkout->sessions->retrieve($sessionId);
    }
}
