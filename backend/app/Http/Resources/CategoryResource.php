<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->relationLoaded('images')
            ? $this->images->map(fn ($image) => Storage::disk('public')->url($image->path))->first()
            : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'parent_id' => $this->parent_id,
            'description' => $this->description,
            'is_active' => (bool) $this->is_active,
            'image' => $imageUrl,
            'products_count' => $this->whenCounted('products'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
