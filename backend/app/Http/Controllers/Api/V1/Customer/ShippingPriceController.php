<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShippingPriceResource;
use App\Models\ShippingPrice;

class ShippingPriceController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => ShippingPriceResource::collection(ShippingPrice::all()),
            'message' => 'تم جلب أسعار الشحن بنجاح',
        ]);
    }
}
