<?php

namespace App\Http\Controllers\Api\V1\Webhooks;

use App\Events\OrderCreated;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Event;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    public function handle(Request $request): Response
    {
        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature'),
                (string) config('services.stripe.webhook_secret'),
            );
        } catch (\UnexpectedValueException|SignatureVerificationException $e) {
            Log::warning('Rejected Stripe webhook: invalid payload or signature.', [
                'error' => $e->getMessage(),
            ]);

            return response('Invalid payload or signature.', 400);
        }

        match ($event->type) {
            'checkout.session.completed' => $this->handleSessionCompleted($event),
            'checkout.session.expired' => $this->handleSessionExpired($event),
            default => null,
        };

        return response('', 200);
    }

    private function handleSessionCompleted(Event $event): void
    {
        $session = $event->data->object;

        $order = Order::where('stripe_session_id', $session->id)->first();

        if (! $order) {
            Log::warning('Stripe webhook: no order matches session.', ['session_id' => $session->id]);

            return;
        }

        $paidOrder = $this->orderService->markAsPaid($order, $session->payment_intent);

        if ($paidOrder) {
            OrderCreated::dispatch($paidOrder);
        }
    }

    private function handleSessionExpired(Event $event): void
    {
        $session = $event->data->object;

        $order = Order::where('stripe_session_id', $session->id)->first();

        if ($order) {
            $this->orderService->cancelAndRestock($order);
        }
    }
}
