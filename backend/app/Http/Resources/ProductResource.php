<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imageUrls = $this->relationLoaded('images')
            ? $this->images->map(fn ($image) => Storage::disk('public')->url($image->path))->values()
            : collect();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'brand' => BrandResource::make($this->whenLoaded('brand')),
            'price' => $this->price,
            'old_price' => $this->old_price,
            'stock' => $this->stock,
            'in_stock' => $this->stock > 0,
            'color' => $this->color,
            'storage' => $this->storage,
            'rating' => $this->rating,
            'reviews_count' => $this->reviews_count,
            'badge' => $this->badge,
            'is_featured' => $this->is_featured,
            'image' => $imageUrls->first(),
            'images' => $imageUrls,
        ];
    }
}
