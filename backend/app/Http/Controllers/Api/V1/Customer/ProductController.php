<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductIndexRequest;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\FileUploadeService;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(ProductIndexRequest $request)
    {
        $data = $request->validated();

        $products = Product::query()
            ->with(['category', 'brand', 'images'])
            ->when($data['category'] ?? null, fn ($q, $slugs) => $q->whereHas('category', fn ($q) => $q->whereIn('slug', explode(',', $slugs))))
            ->when($data['brand'] ?? null, fn ($q, $slugs) => $q->whereHas('brand', fn ($q) => $q->whereIn('slug', explode(',', $slugs))))
            ->when($data['ids'] ?? null, fn ($q, $ids) => $q->whereIn('id', explode(',', $ids)))
            ->when($data['exclude'] ?? null, fn ($q, $id) => $q->whereKeyNot($id))
            ->when($data['min_price'] ?? null, fn ($q, $price) => $q->where('price', '>=', $price))
            ->when($data['max_price'] ?? null, fn ($q, $price) => $q->where('price', '<=', $price))
            ->when($data['min_rating'] ?? null, fn ($q, $rating) => $q->where('rating', '>=', $rating))
            ->when($data['color'] ?? null, fn ($q, $colors) => $q->whereIn('color', explode(',', $colors)))
            ->when($data['storage'] ?? null, fn ($q, $storages) => $q->whereIn('storage', explode(',', $storages)))
            ->when($request->boolean('in_stock'), fn ($q) => $q->where('stock', '>', 0))
            ->when($request->boolean('featured'), fn ($q) => $q->where('is_featured', true))
            ->when($request->boolean('on_sale'), fn ($q) => $q->whereNotNull('old_price')->whereColumn('old_price', '>', 'price'))
            ->when($data['search'] ?? null, fn ($q, $search) => $q->where('title', 'LIKE', "%{$search}%"))
            ->when($data['sort'] ?? null, function ($q, $sort) {
                match ($sort) {
                    'price_asc' => $q->orderBy('price'),
                    'price_desc' => $q->orderByDesc('price'),
                    'rating' => $q->orderByDesc('rating'),
                    'newest' => $q->latest(),
                    'best_selling' => $q->orderByDesc('sales_count'),
                };
            })
            ->paginate($data['per_page'] ?? 12);

        return ProductResource::collection($products)->additional([
            'message' => 'تم جلب المنتجات بنجاح',
        ]);
    }

    public function store(ProductRequest $request)
    {
        $this->authorize('create', Product::class);
        $product = Auth::user()->products()->create($request->validated());

        return response()->json([
            'data' => ProductResource::make($product),
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

        $this->authorize('update', $product);

        if ($request->hasFile('image')) {

            $path = FileUploadeService::update(
                $request->image,
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
        $this->authorize('delete', $product);
        $product->delete();

        return response()->json([
            'message' => 'تم حذف المنتج بنجاح',
        ], 200);

    }
}
