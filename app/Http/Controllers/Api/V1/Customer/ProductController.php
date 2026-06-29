<?php

namespace App\Http\Controllers\Api\v1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\FileUploadeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(){

       return response()->json([
        'data'=> ProductResource::collection(Product::paginate(10)),
        'message'=>'تم جلب المنتجات بنجاح'
        ],200);

    }

    public function store(ProductRequest $request){
        $this->authorize('create', Product::class);
        $product = Auth::user()->products()->create($request->validated());

        return response()->json([
            'data'    => ProductResource::make($product),
            'message' => 'تم إضافة المنتج بنجاح',
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'data' => ProductResource::make($product->load('category')),
            'message' => 'تم جلب المنتج بنجاح',
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {

        $this->authorize('update', $product);

        if($request->hasFile('image')){

          $path = FileUploadeService::update(
            $request->image,
            $product->images->first()?->path,
            'products'
            );
            
          $product->images()->updateOrCreate([],['path' => $path]);
        }

        $product->update($request->validated());

        return response()->json([
            'data' => ProductResource::make($product->load('category', 'images')),
            'message' => 'تم تحديث المنتج بنجاح',
        ]);
    }



    public function destroy(Product $product){
        $this->authorize('delete', $product);
        $product->delete();

         return response()->json([
            'message' => 'تم حذف المنتج بنجاح',
        ], 200);

    }
}
