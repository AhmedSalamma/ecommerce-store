<?php

namespace App\Http\Controllers\Api\v1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductFilterRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function filter(ProductFilterRequest $request)
    {

        $data = $request->validated();

        $products = Product::query()
        ->when(isset($data['title']), fn($q) => $q->where('title', 'LIKE', "%{$data['title']}%"))
        ->when(isset($data['price']), fn($q) => $q->where('price', $data['price']))
        ->paginate(15);

        if ($products->isEmpty()) {
            return response()->json([
            'message' => 'No products found.',
            'data' => []
            
             ], 200);
        }

        return ProductResource::collection($products);
    }
}