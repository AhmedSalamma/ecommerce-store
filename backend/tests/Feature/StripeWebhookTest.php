<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use LazilyRefreshDatabase;

    private const WEBHOOK_SECRET = 'whsec_test_secret';

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
    }

    public function test_rejects_payload_with_invalid_signature(): void
    {
        $response = $this->call(
            'POST',
            '/api/webhooks/stripe',
            server: ['HTTP_Stripe-Signature' => 't='.time().',v1=invalid'],
            content: json_encode(['type' => 'checkout.session.completed']),
        );

        $response->assertStatus(400);
    }

    public function test_marks_order_paid_on_checkout_session_completed(): void
    {
        Event::fake([OrderCreated::class]);

        $user = User::factory()->create();

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-TESTORDER1',
            'subtotal' => 100,
            'shipping_cost' => 10,
            'total' => 110,
            'status' => OrderStatus::PENDING->value,
            'payment_method' => 'stripe',
            'payment_status' => PaymentStatus::UNPAID->value,
            'stripe_session_id' => 'cs_test_123',
        ]);

        $payload = json_encode([
            'id' => 'evt_test_1',
            'object' => 'event',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_123',
                    'object' => 'checkout.session',
                    'payment_intent' => 'pi_test_123',
                ],
            ],
        ]);

        $response = $this->call(
            'POST',
            '/api/webhooks/stripe',
            server: ['HTTP_Stripe-Signature' => $this->signPayload($payload)],
            content: $payload,
        );

        $response->assertStatus(200);

        $order->refresh();

        $this->assertSame(PaymentStatus::PAID->value, $order->payment_status);
        $this->assertSame(OrderStatus::PROCESSING->value, $order->status);
        $this->assertSame('pi_test_123', $order->stripe_payment_intent_id);
        $this->assertNotNull($order->paid_at);

        Event::assertDispatched(OrderCreated::class, fn (OrderCreated $event) => $event->order->is($order));
    }

    public function test_ignores_duplicate_completed_event_for_already_paid_order(): void
    {
        Event::fake([OrderCreated::class]);

        $user = User::factory()->create();

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-TESTORDER2',
            'subtotal' => 100,
            'shipping_cost' => 10,
            'total' => 110,
            'status' => OrderStatus::PROCESSING->value,
            'payment_method' => 'stripe',
            'payment_status' => PaymentStatus::PAID->value,
            'stripe_session_id' => 'cs_test_456',
            'paid_at' => now(),
        ]);

        $payload = json_encode([
            'id' => 'evt_test_2',
            'object' => 'event',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_456',
                    'object' => 'checkout.session',
                    'payment_intent' => 'pi_test_456',
                ],
            ],
        ]);

        $response = $this->call(
            'POST',
            '/api/webhooks/stripe',
            server: ['HTTP_Stripe-Signature' => $this->signPayload($payload)],
            content: $payload,
        );

        $response->assertStatus(200);

        Event::assertNotDispatched(OrderCreated::class);
    }

    private function signPayload(string $payload): string
    {
        $timestamp = time();
        $signature = hash_hmac('sha256', "{$timestamp}.{$payload}", self::WEBHOOK_SECRET);

        return "t={$timestamp},v1={$signature}";
    }
}
