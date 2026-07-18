<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = $this->whenLoaded('product');
        $image = $this->relationLoaded('product') && $this->product->images->isNotEmpty()
            ? Storage::disk('public')->url($this->product->images->first()->path)
            : null;

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'title' => $product->title ?? null,
            'slug' => $product->slug ?? null,
            'image' => $image,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->quantity * $this->price,
        ];
    }
}
