<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items'])
            ->latest()
            ->paginate(15);

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderResource
    {
        $order->load(['items', 'user']);

        return new OrderResource($order);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): OrderResource
    {
        $status = $request->validated('status');

        $timestamps = [];
        switch ($status) {
            case 'confirmed':
                $timestamps['paid_at'] = now();
                break;
            case 'shipped':
                $timestamps['shipped_at'] = now();
                break;
            case 'delivered':
                $timestamps['delivered_at'] = now();
                break;
            case 'cancelled':
                $timestamps['cancelled_at'] = now();
                break;
        }

        DB::transaction(function () use ($order, $status, $timestamps) {
            // Restore stock when cancelling an order that hasn't been cancelled before
            if ($status === 'cancelled' && $order->status !== 'cancelled') {
                $order->load('items');
                foreach ($order->items as $item) {
                    Product::where('id', $item->product_id)
                        ->increment('stock', $item->quantity);
                }
            }

            $order->update(array_merge(['status' => $status], $timestamps));
        });

        $order->load(['items', 'user']);

        return new OrderResource($order);
    }
}
