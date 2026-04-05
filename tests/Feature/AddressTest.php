<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_addresses(): void
    {
        $user = User::factory()->create();
        Address::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/addresses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['uuid', 'label', 'address_line_1', 'city', 'state', 'postal_code', 'country'],
                ],
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_create_address(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/addresses', [
                'label' => 'Home',
                'address_line_1' => '123 Rizal Street',
                'city' => 'Manila',
                'state' => 'Metro Manila',
                'postal_code' => '1000',
                'country' => 'PH',
                'phone' => '+639171234567',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'label',
                    'address_line_1',
                    'city',
                    'state',
                    'postal_code',
                    'country',
                ],
            ]);

        $this->assertDatabaseHas('addresses', [
            'user_id' => $user->id,
            'label' => 'Home',
            'city' => 'Manila',
        ]);
    }

    public function test_can_update_address(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/addresses/{$address->uuid}", [
                'label' => 'Updated Office',
                'address_line_1' => '456 Bonifacio Drive',
                'city' => 'Makati',
                'state' => 'Metro Manila',
                'postal_code' => '1226',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.label', 'Updated Office')
            ->assertJsonPath('data.city', 'Makati');
    }

    public function test_can_delete_address(): void
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/addresses/{$address->uuid}");

        $response->assertStatus(204);

        $this->assertSoftDeleted('addresses', [
            'id' => $address->id,
        ]);
    }
}
