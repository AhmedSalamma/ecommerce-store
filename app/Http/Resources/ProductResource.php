<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'title'=>$this->title,
            'category '=> CategoryResource::make($this->whenLoaded('category')),
            'image'=>$this->whenLoaded('images'),
            'slug'=>$this->slug,
            'description'=>$this->description,
            'price'=>$this->price,
            'stock'=>$this->stock,

        ];
    }
}
