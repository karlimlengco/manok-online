<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'product_id' => Product::factory(),
            'path' => 'products/' . fake()->uuid() . '.jpg',
            'alt' => fake()->sentence(3),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
