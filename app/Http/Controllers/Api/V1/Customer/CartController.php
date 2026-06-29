<?php

namespace App\Http\Controllers\Api\v1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('cartItems.product')->first();

        if(!$cart) {
            return response()->json([
                'data'=> null,
                'message'=>'السلة فارغة'
            ],200);
        }
        return response()->json([
            'data'=> CartResource::make($cart),
            'message'=>'منتجات السله'
        ],200);
    }

    public function store(Product $product, Request $request)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:' . $product->stock,
        ]);

        try{

            DB::transaction(function () use ($product, $validated ,$request) {
                $cart = Cart::firstOrCreate([
                    'user_id' => Auth::id(),
                ]);

                $item = CartItem::where('cart_id', $cart->id)
                                ->where('product_id', $product->id)
                                ->first();

                if ($item) {
                    $item->increment('quantity', $validated['quantity']);
                    $product->decrement('stock', $validated['quantity']);
                } else{
                    CartItem::create([
                        'cart_id'    => $cart->id,
                        'product_id' => $product->id,
                        'quantity'   => $validated['quantity'],
                        'price'      => $product->price,
                    ]);

                    $product->decrement('stock', $validated['quantity']);
                }
                        
                        
                });

        }catch(\Exception){
              return response()->json(['message' => 'حدث خطأ أثناء إضافة المنتج'], 500);
        }

     

        return response()->json(['message' => 'تمت إضافة المنتج إلى السلة'], 201);
    }

    public function delete(CartItem $cartItem) {

        $this->authorize('delete', $cartItem);

        try{
            DB::transaction(function() use ($cartItem){
                $cartItem->product()->increment('stock', $cartItem->quantity);
                $cartItem->delete();

            });
        } catch(\Exception){
              return response()->json(['message' => 'حدث خطأ أثناء حذف المنتج'], 500);
        }

        return response()->json(['message' => 'تم حذف المنتج من السلة'], 200);
      
    }


}