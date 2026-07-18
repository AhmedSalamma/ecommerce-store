<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $productLoaded = $this->relationLoaded('product');
        $image = $productLoaded && $this->product->images->isNotEmpty()
            ? Storage::disk('public')->url($this->product->images->first()->path)
            : null;

        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->quantity * $this->price,
            'product' => [
                'id' => $this->product_id,
                'title' => $productLoaded ? $this->product->title : null,
                'slug' => $productLoaded ? $this->product->slug : null,
                'image' => $image,
            ],
        ];
    }
}
