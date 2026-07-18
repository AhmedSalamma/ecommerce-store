<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\Checkout\CheckoutInProgressException;
use App\Exceptions\Checkout\OutOfStockException;
use App\Exceptions\Checkout\ShippingPriceNotFoundException;
use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingPrice;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        protected CartService $cartService
    ) {}

    public function getAll()
    {
        return Order::with('items.product')->paginate(10);
    }

    public function getOrderById(int $orderId): ?Order
    {
        $userId = Auth::id();

        if (! $userId) {
            throw new AuthenticationException;
        }

        return Order::with(['items.product.images', 'address'])
            ->where('user_id', $userId)
            ->find($orderId);
    }

    public function getUserOrders()
    {
        $user = Auth::user();

        if (! $user) {
            throw new AuthenticationException;
        }

        return $user->orders()->with(['items.product.images', 'address'])->latest()->paginate(10);
    }

    public function create(Cart $cart, Address $address, float $shippingCost, ?string $notes = null, string $paymentMethod = 'stripe'): Order
    {
        $userId = Auth::id();

        if (! $userId) {
            throw new AuthenticationException;
        }

        return DB::transaction(function () use (
            $cart,
            $address,
            $shippingCost,
            $notes,
            $paymentMethod,
            $userId
        ) {
            $lockedCart = Cart::whereKey($cart->id)->lockForUpdate()->first();

            if (! $lockedCart || $lockedCart->checked_out_at !== null) {
                throw new CheckoutInProgressException('عملية الدفع قيد التنفيذ بالفعل لهذه السلة.');
            }

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => 'ORD-'.Str::upper(Str::random(10)),
                'address_id' => $address->id,
                'subtotal' => $cart->subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $cart->subtotal + $shippingCost,
                'status' => OrderStatus::PENDING->value,
                'payment_method' => $paymentMethod,
                'payment_status' => PaymentStatus::UNPAID->value,
                'notes' => $notes,
            ]);

            foreach ($cart->cartItems as $item) {

                $this->decrementStock($item, $item->quantity);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }

            $lockedCart->update(['checked_out_at' => now()]);

            return $order;
        });
    }

    private function decrementStock(CartItem $item, int $quantity)
    {
        $product = $item->product()->lockForUpdate()->first();

        if (! $product) {
            throw new OutOfStockException('المنتج غير موجود');
        }

        if ($product->stock < $quantity) {
            throw new OutOfStockException("الكمية غير متوفرة للمنتج {$product->title}");
        }

        $product->decrement('stock', $quantity);
    }

    public function calculateShippingCost(Address $address): float
    {
        $shipping = ShippingPrice::where(
            'area_name',
            $address->city
        )->first();

        if (! $shipping) {
            throw new ShippingPriceNotFoundException('لا يوجد سعر شحن لهذه المنطقة.');
        }

        return (float) $shipping->price;
    }

    public function cancelAndRestock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->first();

            if (! $lockedOrder || $lockedOrder->status !== OrderStatus::PENDING->value) {
                return;
            }

            foreach ($lockedOrder->items as $orderItem) {
                $orderItem->product()->increment('stock', $orderItem->quantity);
            }

            $lockedOrder->update([
                'status' => OrderStatus::CANCELLED->value,
                'payment_status' => PaymentStatus::FAILED->value,
            ]);

            Cart::where('user_id', $lockedOrder->user_id)->update(['checked_out_at' => null]);
        });
    }

    public function markAsPaid(Order $order, ?string $paymentIntentId = null): ?Order
    {
        return DB::transaction(function () use ($order, $paymentIntentId) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->first();

            if (! $lockedOrder || $lockedOrder->payment_status === PaymentStatus::PAID->value) {
                return null;
            }

            $lockedOrder->update([
                'payment_status' => PaymentStatus::PAID->value,
                'status' => OrderStatus::PROCESSING->value,
                'stripe_payment_intent_id' => $paymentIntentId,
                'paid_at' => now(),
            ]);

            $cart = Cart::where('user_id', $lockedOrder->user_id)->first();

            if ($cart) {
                $this->cartService->clearCart($cart);
            }

            return $lockedOrder;
        });
    }
}
