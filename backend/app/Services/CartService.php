<?php

namespace App\Services;

use App\Exceptions\Checkout\CartIsEmptyException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function getUserCart(): Cart
    {
        $user = Auth::user();

        if (! $user) {
            throw new AuthenticationException;
        }

        $cart = $user
            ->cart()
            ->with('cartItems.product.images')
            ->first();

        if (! $cart || $cart->cartItems->isEmpty()) {
            throw new CartIsEmptyException('السلة فارغة، لا يمكن إنشاء طلب.');
        }

        return $cart;
    }

    public function getOrCreateUserCart(): Cart
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        return $cart->load('cartItems.product.images');
    }

    public function store(Product $product, int $quantity): void
    {
        DB::transaction(function () use ($product, $quantity) {

            $cart = Cart::firstOrCreate([
                'user_id' => Auth::id(),
            ]);

            $item = $cart->cartItems()
                ->where('product_id', $product->id)
                ->first();

            if ($item) {
                $item->increment('quantity', $quantity);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);
            }

            $this->recalculateSubtotal($cart);
        });
    }

    public function updateQuantity(CartItem $cartItem, int $quantity): void
    {
        DB::transaction(function () use ($cartItem, $quantity) {
            $cartItem->update(['quantity' => $quantity]);
            $this->recalculateSubtotal($cartItem->cart);
        });
    }

    public function removeItem(CartItem $cartItem): void
    {
        DB::transaction(function () use ($cartItem) {
            $cart = $cartItem->cart;
            $cartItem->delete();
            $this->recalculateSubtotal($cart);
        });
    }

    public function clearCart(Cart $cart): void
    {
        $cart->cartItems()->delete();
        $cart->delete();
    }

    private function recalculateSubtotal(Cart $cart): void
    {
        $cart->load('cartItems');

        $subtotal = $cart->cartItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        $cart->update(['subtotal' => $subtotal]);
    }
}
