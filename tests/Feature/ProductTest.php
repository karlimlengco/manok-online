<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_products(): void
    {
        Product::factory()->count(15)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['uuid', 'name', 'slug', 'price', 'breed', 'status'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);

        // Default pagination is 12
        $this->assertCount(12, $response->json('data'));
    }

    public function test_products_only_shows_active(): void
    {
        Product::factory()->count(3)->create(['status' => 'active']);
        Product::factory()->count(2)->draft()->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_filter_products_by_breed(): void
    {
        Product::factory()->count(3)->create(['breed' => 'Kelso']);
        Product::factory()->count(2)->create(['breed' => 'Hatch']);

        $response = $this->getJson('/api/products?filter[breed]=Kelso');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));

        foreach ($response->json('data') as $product) {
            $this->assertEquals('Kelso', $product['breed']);
        }
    }

    public function test_can_sort_products_by_price(): void
    {
        Product::factory()->create(['price' => 5000]);
        Product::factory()->create(['price' => 1000]);
        Product::factory()->create(['price' => 3000]);

        $response = $this->getJson('/api/products?sort=price');

        $response->assertStatus(200);

        $prices = array_column($response->json('data'), 'price');
        $sorted = $prices;
        sort($sorted);
        $this->assertEquals($sorted, $prices);
    }

    public function test_can_view_single_product_with_images(): void
    {
        $product = Product::factory()->create();
        ProductImage::factory()->count(3)->create(['product_id' => $product->id]);

        $response = $this->getJson("/api/products/{$product->slug}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'name',
                    'slug',
                    'price',
                    'breed',
                    'images',
                ],
            ]);

        $this->assertCount(3, $response->json('data.images'));
    }

    public function test_product_not_found_returns_404(): void
    {
        $response = $this->getJson('/api/products/non-existent-slug');

        $response->assertStatus(404);
    }
}
