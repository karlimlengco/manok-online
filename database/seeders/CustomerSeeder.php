<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::where('status', 'active')->get();

        $customers = [
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan.delacruz@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '123 Rizal Street', 'city' => 'Quezon City', 'state' => 'Metro Manila', 'postal_code' => '1100', 'phone' => '+639171234567', 'is_default' => true],
                    ['label' => 'Farm', 'address_line_1' => 'Lot 5 Block 3 Sabana Farms', 'address_line_2' => 'Brgy. San Isidro', 'city' => 'Tarlac City', 'state' => 'Tarlac', 'postal_code' => '2300', 'phone' => '+639171234567', 'is_default' => false],
                ],
                'has_cart' => true,
                'has_orders' => true,
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria.santos@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '45 Mabini Avenue', 'city' => 'Makati', 'state' => 'Metro Manila', 'postal_code' => '1200', 'phone' => '+639182345678', 'is_default' => true],
                ],
                'has_cart' => false,
                'has_orders' => true,
            ],
            [
                'name' => 'Pedro Reyes',
                'email' => 'pedro.reyes@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '78 Bonifacio Drive', 'address_line_2' => 'Unit 4B', 'city' => 'Pasig', 'state' => 'Metro Manila', 'postal_code' => '1600', 'phone' => '+639193456789', 'is_default' => true],
                    ['label' => 'Office', 'address_line_1' => '12 Ayala Center', 'city' => 'Makati', 'state' => 'Metro Manila', 'postal_code' => '1226', 'phone' => '+639193456789', 'is_default' => false],
                ],
                'has_cart' => true,
                'has_orders' => false,
            ],
            [
                'name' => 'Jose Garcia',
                'email' => 'jose.garcia@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '234 Luna Street', 'city' => 'Cebu City', 'state' => 'Cebu', 'postal_code' => '6000', 'phone' => '+639204567890', 'is_default' => true],
                ],
                'has_cart' => false,
                'has_orders' => true,
            ],
            [
                'name' => 'Ricardo Mendoza',
                'email' => 'ricardo.mendoza@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '56 Del Pilar Road', 'city' => 'Davao City', 'state' => 'Davao del Sur', 'postal_code' => '8000', 'phone' => '+639215678901', 'is_default' => true],
                    ['label' => 'Warehouse', 'address_line_1' => 'Building 3 Sasa Industrial Zone', 'city' => 'Davao City', 'state' => 'Davao del Sur', 'postal_code' => '8000', 'phone' => '+639215678901', 'is_default' => false],
                ],
                'has_cart' => true,
                'has_orders' => false,
            ],
            [
                'name' => 'Antonio Ramos',
                'email' => 'antonio.ramos@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '89 Aguinaldo Highway', 'city' => 'Imus', 'state' => 'Cavite', 'postal_code' => '4103', 'phone' => '+639226789012', 'is_default' => true],
                ],
                'has_cart' => false,
                'has_orders' => false,
            ],
            [
                'name' => 'Carlo Villanueva',
                'email' => 'carlo.villanueva@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '12 Magsaysay Boulevard', 'city' => 'Angeles City', 'state' => 'Pampanga', 'postal_code' => '2009', 'phone' => '+639237890123', 'is_default' => true],
                    ['label' => 'Farm', 'address_line_1' => 'Km 78 MacArthur Highway', 'address_line_2' => 'Brgy. Dolores', 'city' => 'San Fernando', 'state' => 'Pampanga', 'postal_code' => '2000', 'phone' => '+639237890123', 'is_default' => false],
                ],
                'has_cart' => true,
                'has_orders' => false,
            ],
            [
                'name' => 'Roberto Aquino',
                'email' => 'roberto.aquino@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '345 Quezon Avenue', 'city' => 'Caloocan', 'state' => 'Metro Manila', 'postal_code' => '1400', 'phone' => '+639248901234', 'is_default' => true],
                ],
                'has_cart' => false,
                'has_orders' => false,
            ],
            [
                'name' => 'Fernando Bautista',
                'email' => 'fernando.bautista@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '67 Burgos Street', 'city' => 'Lipa', 'state' => 'Batangas', 'postal_code' => '4217', 'phone' => '+639259012345', 'is_default' => true],
                ],
                'has_cart' => false,
                'has_orders' => false,
            ],
            [
                'name' => 'Miguel Tolentino',
                'email' => 'miguel.tolentino@email.com',
                'addresses' => [
                    ['label' => 'Home', 'address_line_1' => '890 National Road', 'address_line_2' => 'Brgy. Poblacion', 'city' => 'Binan', 'state' => 'Laguna', 'postal_code' => '4024', 'phone' => '+639260123456', 'is_default' => true],
                    ['label' => 'Farm', 'address_line_1' => 'Sitio Malabag', 'address_line_2' => 'Brgy. Canlubang', 'city' => 'Calamba', 'state' => 'Laguna', 'postal_code' => '4027', 'phone' => '+639260123456', 'is_default' => false],
                ],
                'has_cart' => false,
                'has_orders' => false,
            ],
        ];

        foreach ($customers as $customerData) {
            $user = User::factory()->create([
                'name' => $customerData['name'],
                'email' => $customerData['email'],
                'password' => 'password',
            ]);

            $user->assignRole('customer');

            // Create addresses
            foreach ($customerData['addresses'] as $address) {
                Address::create(array_merge($address, [
                    'user_id' => $user->id,
                    'country' => 'PH',
                ]));
            }

            // Create cart with items
            if ($customerData['has_cart']) {
                $cart = Cart::create(['user_id' => $user->id]);
                $cartProducts = $products->random(rand(1, 3));

                foreach ($cartProducts as $product) {
                    $quantity = rand(1, 2);
                    CartItem::create([
                        'cart_id' => $cart->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $product->price,
                    ]);
                }
            }

            // Create orders
            if ($customerData['has_orders']) {
                $defaultAddress = $user->addresses()->where('is_default', true)->first();
                $shippingAddress = [
                    'name' => $user->name,
                    'address_line_1' => $defaultAddress->address_line_1,
                    'address_line_2' => $defaultAddress->address_line_2,
                    'city' => $defaultAddress->city,
                    'state' => $defaultAddress->state,
                    'postal_code' => $defaultAddress->postal_code,
                    'country' => $defaultAddress->country,
                    'phone' => $defaultAddress->phone,
                ];

                $orderCount = rand(1, 2);
                for ($o = 0; $o < $orderCount; $o++) {
                    $orderProducts = $products->random(rand(1, 3));
                    $subtotal = 0;
                    $items = [];

                    foreach ($orderProducts as $product) {
                        $quantity = rand(1, 2);
                        $itemTotal = $product->price * $quantity;
                        $subtotal += $itemTotal;

                        $items[] = [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'product_slug' => $product->slug,
                            'quantity' => $quantity,
                            'price' => $product->price,
                            'total' => $itemTotal,
                        ];
                    }

                    $shippingFee = $subtotal >= 10000 ? 0 : 200;
                    $total = $subtotal + $shippingFee;

                    $statuses = ['pending', 'processing', 'shipped', 'delivered'];
                    $status = $statuses[array_rand($statuses)];

                    $order = Order::create([
                        'user_id' => $user->id,
                        'order_number' => 'RO-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                        'status' => $status,
                        'subtotal' => $subtotal,
                        'shipping_fee' => $shippingFee,
                        'total' => $total,
                        'shipping_address' => $shippingAddress,
                        'billing_address' => $shippingAddress,
                        'notes' => $o === 0 ? 'Please handle with care.' : null,
                        'paid_at' => in_array($status, ['processing', 'shipped', 'delivered']) ? now()->subDays(rand(1, 30)) : null,
                        'shipped_at' => in_array($status, ['shipped', 'delivered']) ? now()->subDays(rand(1, 15)) : null,
                        'delivered_at' => $status === 'delivered' ? now()->subDays(rand(1, 5)) : null,
                    ]);

                    foreach ($items as $item) {
                        OrderItem::create(array_merge($item, [
                            'order_id' => $order->id,
                        ]));
                    }
                }
            }
        }
    }
}
