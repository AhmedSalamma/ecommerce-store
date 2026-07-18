<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Models\Brand;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::query()->withCount('products')->get();

        return response()->json([
            'data' => BrandResource::collection($brands),
            'message' => 'تم جلب العلامات التجارية بنجاح',
        ]);
    }
}
