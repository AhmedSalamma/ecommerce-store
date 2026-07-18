<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
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
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'country' => $this->country,
            'city' => $this->city,
            'state' => $this->state,
            'street' => $this->street,
            'notes' => $this->notes,
            'type' => $this->type,
        ];
    }
}
