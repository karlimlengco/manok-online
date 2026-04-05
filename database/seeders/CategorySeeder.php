<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fighting Breeds',
                'slug' => 'fighting-breeds',
                'description' => 'Champion bloodline roosters bred for strength and agility',
                'sort_order' => 1,
            ],
            [
                'name' => 'Ornamental Breeds',
                'slug' => 'ornamental-breeds',
                'description' => 'Beautiful show roosters with stunning plumage and colors',
                'sort_order' => 2,
            ],
            [
                'name' => 'Breeding Stock',
                'slug' => 'breeding-stock',
                'description' => 'Premium breeding roosters with proven genetic lineage',
                'sort_order' => 3,
            ],
            [
                'name' => 'Rare Breeds',
                'slug' => 'rare-breeds',
                'description' => 'Hard-to-find exotic and heritage rooster breeds',
                'sort_order' => 4,
            ],
            [
                'name' => 'Young Stags',
                'slug' => 'young-stags',
                'description' => 'Young roosters under 12 months ready for training or showing',
                'sort_order' => 5,
            ],
            [
                'name' => 'Game Fowl Supplies',
                'slug' => 'game-fowl-supplies',
                'description' => 'Feed, supplements, vitamins, and care essentials',
                'sort_order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
