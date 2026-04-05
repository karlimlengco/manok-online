<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        $cities = ['Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Makati', 'Pasig', 'Taguig', 'Caloocan'];
        $states = ['Metro Manila', 'Cebu', 'Davao del Sur', 'Laguna', 'Cavite', 'Bulacan', 'Pampanga', 'Rizal'];

        return [
            'uuid' => fake()->uuid(),
            'user_id' => User::factory(),
            'label' => fake()->randomElement(['Home', 'Office', 'Farm', 'Warehouse']),
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => fake()->optional()->secondaryAddress(),
            'city' => fake()->randomElement($cities),
            'state' => fake()->randomElement($states),
            'postal_code' => fake()->numerify('####'),
            'country' => 'PH',
            'phone' => fake()->numerify('+639#########'),
            'is_default' => false,
        ];
    }

    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
