<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartItemRequest;
use App\Http\Requests\CartRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function __construct(
        public CartService $cartService,
    ) {}

    public function index()
    {
        return response()->json([
            'data' => CartResource::make($this->cartService->getOrCreateUserCart()),
            'message' => 'منتجات السله',
        ], 200);
    }

    public function store(Product $product, CartRequest $request)
    {
        $validated = $request->validated();

        $this->cartService->store($product, $validated['quantity']);

        return response()->json([
            'message' => 'تم إضافة المنتج إلى السلة بنجاح.',
        ], 201);
    }

    public function update(CartItem $cartItem, CartItemRequest $request)
    {
        abort_unless($cartItem->cart->user_id === Auth::id(), 403);

        $this->cartService->updateQuantity($cartItem, $request->validated()['quantity']);

        return response()->json([
            'message' => 'تم تحديث الكمية بنجاح.',
        ], 200);
    }

    public function delete(CartItem $cartItem)
    {
        abort_unless($cartItem->cart->user_id === Auth::id(), 403);

        $this->cartService->removeItem($cartItem);

        return response()->json([
            'message' => 'تم حذف المنتج من السلة بنجاح.',
        ], 200);
    }

    public function clearCart(Cart $cart): void
    {
        $this->cartService->clearCart($cart);
    }
}
