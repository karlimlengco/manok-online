<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private function createCartWithItems(User $user, array $products = []): Cart
    {
        $cart = Cart::create(['user_id' => $user->id]);

        if (empty($products)) {
            $products = [Product::factory()->create(['stock' => 10, 'price' => 1000])];
        }

        foreach ($products as $product) {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => 2,
                'price' => $product->price,
            ]);
        }

        return $cart;
    }

    public function test_authenticated_user_can_list_orders(): void
    {
        $user = User::factory()->create();

        // Create orders directly for this user
        Order::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/orders');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['uuid', 'order_number', 'status', 'total'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_create_order_from_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 1500]);
        $this->createCartWithItems($user, [$product]);
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', [
                'shipping_address_id' => $address->uuid,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'order_number',
                    'status',
                    'subtotal',
                    'total',
                    'items',
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    public function test_order_decrements_product_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 1000]);
        $this->createCartWithItems($user, [$product]);
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', [
                'shipping_address_id' => $address->uuid,
            ]);

        $product->refresh();
        $this->assertEquals(8, $product->stock); // 10 - 2 (quantity from createCartWithItems)
    }

    public function test_order_clears_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 1000]);
        $cart = $this->createCartWithItems($user, [$product]);
        $address = Address::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', [
                'shipping_address_id' => $address->uuid,
            ]);

        $this->assertCount(0, $cart->fresh()->items);
    }

    public function test_cannot_order_with_empty_cart(): void
    {
        $user = User::factory()->create();
        Cart::create(['user_id' => $user->id]); // empty cart
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', [
                'shipping_address_id' => $address->uuid,
            ]);

        $response->assertStatus(422);
    }

    public function test_can_view_own_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/orders/{$order->uuid}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'order_number',
                    'status',
                    'total',
                ],
            ]);
    }

    public function test_cannot_view_another_users_order(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user1->id]);

        $response = $this->actingAs($user2, 'sanctum')
            ->getJson("/api/orders/{$order->uuid}");

        $response->assertStatus(403);
    }

    public function test_order_has_correct_totals(): void
    {
        $user = User::factory()->create();
        $product1 = Product::factory()->create(['stock' => 10, 'price' => 1000]);
        $product2 = Product::factory()->create(['stock' => 10, 'price' => 2500]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'price' => $product1->price,
        ]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 1,
            'price' => $product2->price,
        ]);

        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', [
                'shipping_address_id' => $address->uuid,
            ]);

        $response->assertStatus(201);

        // subtotal = (1000 * 2) + (2500 * 1) = 4500
        $expectedSubtotal = 4500.00;
        $this->assertEquals($expectedSubtotal, (float) $response->json('data.subtotal'));
        $this->assertEquals($expectedSubtotal, (float) $response->json('data.total'));
    }
}
