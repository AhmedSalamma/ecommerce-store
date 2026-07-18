<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->withCount('products')
            ->with('images')
            ->where('is_active', true)
            ->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
            'message' => 'تم جلب الفئات بنجاح',
        ]);
    }
}
