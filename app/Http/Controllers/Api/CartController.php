<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartController extends Controller
{
    public function index(): CartResource
    {
        $cart = $this->getOrCreateCart();
        $cart->load('items.product.images');

        return new CartResource($cart);
    }

    public function store(StoreCartItemRequest $request): CartResource
    {
        $cart = $this->getOrCreateCart();
        $product = Product::where('uuid', $request->validated('product_uuid'))
            ->where('status', 'active')
            ->firstOrFail();

        $requestedQty = $request->validated('quantity');

        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        $totalQty = $existingItem
            ? $existingItem->quantity + $requestedQty
            : $requestedQty;

        abort_if($totalQty > $product->stock, 422, 'Not enough stock available. Only ' . $product->stock . ' left.');

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $totalQty,
                'price' => $product->price,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $requestedQty,
                'price' => $product->price,
            ]);
        }

        $cart->load('items.product.images');

        return new CartResource($cart);
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): CartResource
    {
        $cart = $this->getOrCreateCart();

        abort_unless($cartItem->cart_id === $cart->id, 403, 'This item does not belong to your cart.');

        $quantity = $request->validated('quantity');
        $product = $cartItem->product;

        abort_if($quantity > $product->stock, 422, 'Not enough stock available. Only ' . $product->stock . ' left.');

        $cartItem->update([
            'quantity' => $quantity,
            'price' => $product->price,
        ]);

        $cart->load('items.product.images');

        return new CartResource($cart);
    }

    public function destroy(CartItem $cartItem): CartResource
    {
        $cart = $this->getOrCreateCart();

        abort_unless($cartItem->cart_id === $cart->id, 403, 'This item does not belong to your cart.');

        $cartItem->delete();

        $cart->load('items.product.images');

        return new CartResource($cart);
    }

    private function getOrCreateCart(): Cart
    {
        return Cart::firstOrCreate(['user_id' => auth()->id()]);
    }
}
