<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with('items')
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        abort_if(! $cart || $cart->items->isEmpty(), 422, 'Your cart is empty.');

        $shippingAddress = Address::where('uuid', $request->validated('shipping_address_id'))
            ->where('user_id', $user->id)
            ->firstOrFail();

        $billingAddress = null;
        if ($request->validated('billing_address_id')) {
            $billingAddress = Address::where('uuid', $request->validated('billing_address_id'))
                ->where('user_id', $user->id)
                ->firstOrFail();
        }

        $order = DB::transaction(function () use ($user, $cart, $shippingAddress, $billingAddress, $request) {
            // Validate stock availability for all items before proceeding
            foreach ($cart->items as $item) {
                $product = Product::where('id', $item->product_id)->lockForUpdate()->first();
                abort_if(! $product || $product->status !== 'active', 422, "Product \"{$item->product->name}\" is no longer available.");
                abort_if($product->stock < $item->quantity, 422, "Not enough stock for \"{$product->name}\". Only {$product->stock} left.");
            }

            $subtotal = $cart->items->sum(fn ($item) => $item->quantity * $item->product->price);
            $shippingFee = 0;
            $total = $subtotal + $shippingFee;

            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'shipping_address' => $shippingAddress->only([
                    'label', 'address_line_1', 'address_line_2',
                    'city', 'state', 'postal_code', 'country', 'phone',
                ]),
                'billing_address' => $billingAddress?->only([
                    'label', 'address_line_1', 'address_line_2',
                    'city', 'state', 'postal_code', 'country', 'phone',
                ]),
                'notes' => $request->validated('notes'),
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_slug' => $item->product->slug,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'total' => $item->quantity * $item->product->price,
                ]);

                $affected = Product::where('id', $item->product_id)
                    ->where('stock', '>=', $item->quantity)
                    ->update(['stock' => DB::raw('stock - ' . (int) $item->quantity)]);

                abort_if($affected === 0, 422, "Failed to reserve stock for \"{$item->product->name}\".");
            }

            $cart->items()->delete();

            return $order;
        });

        $order->load('items');

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Order $order): OrderResource
    {
        abort_unless($order->user_id === auth()->id(), 403, 'This order does not belong to you.');

        $order->load('items');

        return new OrderResource($order);
    }
}
