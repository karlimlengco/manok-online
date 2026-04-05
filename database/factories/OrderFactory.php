<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $subtotal = fake()->numberBetween(1000, 50000);
        $shippingFee = 0;

        return [
            'uuid' => fake()->uuid(),
            'user_id' => User::factory(),
            'order_number' => 'RO-' . now()->format('Ymd') . '-' . strtoupper(fake()->bothify('?????')),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $subtotal + $shippingFee,
            'shipping_address' => [
                'label' => 'Home',
                'address_line_1' => fake()->streetAddress(),
                'address_line_2' => null,
                'city' => 'Manila',
                'state' => 'Metro Manila',
                'postal_code' => '1000',
                'country' => 'PH',
                'phone' => '+639171234567',
            ],
            'billing_address' => null,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
