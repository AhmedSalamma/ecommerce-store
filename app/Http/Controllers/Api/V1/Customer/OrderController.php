<?php

namespace App\Http\Controllers\Api\v1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShippingPrice;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(){
        return OrderResource::collection(
            Auth::user()->orders()->paginate(10)
        );
    }

    public function store(OrderRequest $request){

        $cart = Auth::user()->cart()->first();

        $aaddress = Auth::user()->addresses()->findOrFail($request->addressId);

        $shipPrice = ShippingPrice::where('area_name',$aaddress->city)->first();

        if(!$cart || $cart->cartItems()->count() == 0) {
             return response()->json(['message' => 'السلة فارغة لايمكنك إنشاء طلب'], 422);
        }

        if (!$shipPrice) {
            return response()->json(['message' => 'لا يوجد سعر شحن لهذه المنطقة'], 422);
        }

        try{

            DB::transaction(function () use ($cart, $aaddress, $shipPrice, $request){

                $order = Order::create([
                    'user_id'      => Auth::id(),
                    'order_number' => 'ORD-' . Str::uuid(),
                    'address_id'   => $request->addressId,
                    'subtotal'     => $cart->subtotal,
                    'shipping_cost'=> $shipPrice->price,
                    'total'        => $cart->subtotal + $shipPrice->price,
                    'status'=>'pending',
                    'notes'=>$request->notes,

                    ]);

                foreach ($cart->cartItems as $item) {
                    OrderItem::create([
                        'order_id'   => $order->id,
                        'product_id' => $item->product_id,
                        'quantity'   => $item->quantity,
                        'price'      => $item->price,
                    ]);
                }

                $cart->cartItems()->delete();
                $cart->delete();

                return response()->json([
                    'message' => 'تم إنشاء الطلب بنجاح',
                    'order'   => new OrderResource($order),
                ], 201);

                
            });

            
        } catch(Exception $e){
            Log::error(Auth::user()?->name . ' مشكلة أثناء إتمام الطلب: ' . $e->getMessage());

            return response()->json([
                    'message' => 'حدثت مشكلة أثناء إكمال الطلب'
            ], 500);
        }

        
    }
}
