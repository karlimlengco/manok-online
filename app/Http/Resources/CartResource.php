<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');
        $loadedItems = $this->relationLoaded('items') ? $this->items : collect();

        return [
            'uuid' => $this->uuid,
            'items' => CartItemResource::collection($items),
            'items_count' => $loadedItems->count(),
            'total' => number_format($loadedItems->sum(fn ($item) => $item->quantity * $item->price), 2, '.', ''),
        ];
    }
}
