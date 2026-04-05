<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_cart(): void
    {
        $user = User::factory()->create();
        // Pre-create the cart so it's not a new resource
        Cart::create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/cart');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'items',
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_view_cart(): void
    {
        $response = $this->getJson('/api/cart');

        $response->assertStatus(401);
    }

    public function test_can_add_product_to_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);
        // Pre-create the cart so the resource is not "newly created"
        Cart::create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_uuid' => $product->uuid,
                'quantity' => 2,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'items',
                ],
            ]);

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    public function test_adding_same_product_increments_quantity(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_uuid' => $product->uuid,
                'quantity' => 2,
            ]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_uuid' => $product->uuid,
                'quantity' => 3,
            ]);

        $cart = Cart::where('user_id', $user->id)->first();
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        $this->assertEquals(5, $cartItem->quantity);
    }

    public function test_can_update_cart_item_quantity(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);
        $cart = Cart::create(['user_id' => $user->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => $product->price,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson("/api/cart/items/{$cartItem->uuid}", [
                'quantity' => 5,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 5,
        ]);
    }

    public function test_can_remove_cart_item(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);
        $cart = Cart::create(['user_id' => $user->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => $product->price,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/cart/items/{$cartItem->uuid}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }

    public function test_cannot_add_out_of_stock_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->outOfStock()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart/items', [
                'product_uuid' => $product->uuid,
                'quantity' => 1,
            ]);

        // The application validates stock availability and rejects out-of-stock products
        $response->assertStatus(422);
    }

    public function test_cannot_modify_another_users_cart_item(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);

        $cart = Cart::create(['user_id' => $user1->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => $product->price,
        ]);

        $response = $this->actingAs($user2, 'sanctum')
            ->patchJson("/api/cart/items/{$cartItem->uuid}", [
                'quantity' => 5,
            ]);

        $response->assertStatus(403);
    }
}
