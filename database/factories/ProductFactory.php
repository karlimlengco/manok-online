<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $breeds = ['Kelso', 'Hatch', 'Sweater', 'Roundhead', 'Albany', 'Asil'];
        $breed = fake()->randomElement($breeds);
        $name = $breed . ' ' . fake()->word() . ' Rooster';

        return [
            'uuid' => fake()->uuid(),
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(500, 50000),
            'compare_price' => fake()->optional()->numberBetween(50000, 75000),
            'stock' => fake()->numberBetween(0, 20),
            'breed' => $breed,
            'age_months' => fake()->numberBetween(3, 36),
            'weight_kg' => fake()->randomFloat(2, 1.5, 5.0),
            'color' => fake()->randomElement(['Red', 'Black', 'Brown', 'White', 'Grey']),
            'status' => 'active',
            'is_featured' => fake()->boolean(20),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }
}
