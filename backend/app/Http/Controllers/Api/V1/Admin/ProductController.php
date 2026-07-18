<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\FileUploadeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->with(['category', 'brand', 'images'])
            ->when($request->string('search')->toString(), fn ($q, $search) => $q->where('title', 'LIKE', "%{$search}%"))
            ->when($request->integer('category_id'), fn ($q, $categoryId) => $q->where('category_id', $categoryId))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return ProductResource::collection($products)->additional([
            'message' => 'تم جلب المنتجات بنجاح',
        ]);
    }

    public function store(ProductRequest $request)
    {
        $product = Auth::user()->products()->create($request->validated());

        if ($request->hasFile('image')) {
            $product->images()->create([
                'path' => $request->file('image')->store('products', 'public'),
            ]);
        }

        return response()->json([
            'data' => ProductResource::make($product->load('category', 'brand', 'images')),
            'message' => 'تم إضافة المنتج بنجاح',
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'data' => ProductResource::make($product->load('category', 'brand', 'images')),
            'message' => 'تم جلب المنتج بنجاح',
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        if ($request->hasFile('image')) {
            $path = FileUploadeService::update(
                $request->file('image'),
                $product->images->first()?->path,
                'products'
            );

            $product->images()->updateOrCreate([], ['path' => $path]);
        }

        $product->update($request->validated());

        return response()->json([
            'data' => ProductResource::make($product->load('category', 'brand', 'images')),
            'message' => 'تم تحديث المنتج بنجاح',
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'تم حذف المنتج بنجاح',
        ]);
    }
}
