<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin']);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    public function test_admin_can_create_product(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/products', [
                'category_uuid' => $category->uuid,
                'name' => 'Premium Kelso Rooster',
                'slug' => 'premium-kelso-rooster',
                'description' => 'A fine Kelso bloodline rooster.',
                'price' => 15000,
                'stock' => 5,
                'breed' => 'Kelso',
                'status' => 'active',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'name',
                    'slug',
                    'price',
                    'breed',
                    'status',
                ],
            ])
            ->assertJsonPath('data.name', 'Premium Kelso Rooster');

        $this->assertDatabaseHas('products', [
            'name' => 'Premium Kelso Rooster',
            'breed' => 'Kelso',
        ]);
    }

    public function test_admin_can_update_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/products/{$product->slug}", [
                'name' => 'Updated Rooster Name',
                'price' => 20000,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Rooster Name');
    }

    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/admin/products/{$product->slug}");

        $response->assertStatus(204);

        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }

    public function test_non_admin_cannot_access_admin_products(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/admin/products');

        $response->assertStatus(403);
    }
}
