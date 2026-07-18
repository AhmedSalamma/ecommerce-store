<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'image' => $this->image,
            'addresses' => $this->whenLoaded('addresses'),
            'cart' => $this->whenLoaded('cart'),
            'orders' => $this->whenLoaded('orders'),
            'orders_count' => $this->whenCounted('orders'),
            'products_count' => $this->whenCounted('products'),
            'created_at' => $this->created_at,
        ];
    }
}
