<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\FileUploadeService;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->withCount('products')
            ->with('images')
            ->latest()
            ->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
            'message' => 'تم جلب الفئات بنجاح',
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->safe()->except('image'));

        if ($request->hasFile('image')) {
            $category->images()->create([
                'path' => $request->file('image')->store('categories', 'public'),
            ]);
        }

        return response()->json([
            'data' => CategoryResource::make($category->load('images')),
            'message' => 'تم إضافة الفئة بنجاح',
        ], 201);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        if ($request->hasFile('image')) {
            $path = FileUploadeService::update(
                $request->file('image'),
                $category->images->first()?->path,
                'categories'
            );

            $category->images()->updateOrCreate([], ['path' => $path]);
        }

        $category->update($request->safe()->except('image'));

        return response()->json([
            'data' => CategoryResource::make($category->load('images')),
            'message' => 'تم تحديث الفئة بنجاح',
        ]);
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            abort(422, 'لا يمكن حذف فئة تحتوي على منتجات.');
        }

        $category->delete();

        return response()->json([
            'message' => 'تم حذف الفئة بنجاح',
        ]);
    }
}
