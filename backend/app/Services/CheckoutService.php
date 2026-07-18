<?php

namespace App\Services;

use App\Enums\PaymentMethod;
use App\Events\OrderCreated;
use App\Exceptions\PaymentFailedException;
use App\Models\Order;
use App\Services\Payment\Contracts\PaymentInterface;
use App\Services\Payment\StripePaymentService;

class CheckoutService
{
    public function __construct(
        protected OrderService $orderService,
        protected CartService $cartService,
        protected AddressService $addressService,
        protected StripePaymentService $stripePaymentService,
    ) {}

    public function process(int $addressId, ?string $notes = null, string $paymentMethod = 'stripe'): array
    {
        $gateway = $this->paymentMethod($paymentMethod);

        $cart = $this->cartService->getUserCart();
        $address = $this->addressService->getOrderAddress($addressId);
        $shippingCost = $this->orderService->calculateShippingCost($address);
        $order = $this->orderService->create($cart, $address, $shippingCost, $notes, $paymentMethod);

        try {
            $session = $gateway->pay($order);
        } catch (\Throwable $e) {
            $this->orderService->cancelAndRestock($order);

            throw new PaymentFailedException(
                'تعذر بدء عملية الدفع، حاول مرة أخرى.',
                previous: $e
            );
        }

        $order->update(['stripe_session_id' => $session->id]);

        return [
            'order' => $order,
            'session_url' => $session->url,
            'session_id' => $session->id,
            'success_url' => $session->success_url,
            'cancel_url' => $session->cancel_url,
        ];
    }

    public function reconcile(Order $order, string $sessionId): ?Order
    {
        if ($order->stripe_session_id !== $sessionId) {
            return null;
        }

        $session = $this->stripePaymentService->retrieveSession($sessionId);

        if ($session->payment_status !== 'paid') {
            return null;
        }

        $paidOrder = $this->orderService->markAsPaid($order, $session->payment_intent);

        if ($paidOrder) {
            OrderCreated::dispatch($paidOrder);
        }

        return $paidOrder;
    }

    private function paymentMethod(string $method): PaymentInterface
    {
        return match ($method) {
            PaymentMethod::STRIPE->value => $this->stripePaymentService,

            default => throw new \InvalidArgumentException('وسيلة الدفع غير مدعومة.'),
        };
    }
}
