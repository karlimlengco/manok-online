<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $this->seedFightingBreeds($categories->get('fighting-breeds'));
        $this->seedOrnamentalBreeds($categories->get('ornamental-breeds'));
        $this->seedBreedingStock($categories->get('breeding-stock'));
        $this->seedRareBreeds($categories->get('rare-breeds'));
        $this->seedYoungStags($categories->get('young-stags'));
        $this->seedSupplies($categories->get('game-fowl-supplies'));
    }

    private static int $imageIndex = 1;

    private function createProduct(Category $category, array $data): Product
    {
        $name = $data['name'];
        $slug = Str::slug($name);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => $name,
            'slug' => $slug,
            'description' => $data['description'],
            'price' => $data['price'],
            'compare_price' => $data['compare_price'] ?? null,
            'stock' => $data['stock'],
            'breed' => $data['breed'] ?? null,
            'age_months' => $data['age_months'] ?? null,
            'weight_kg' => $data['weight_kg'] ?? null,
            'color' => $data['color'] ?? null,
            'status' => $data['status'] ?? 'active',
            'is_featured' => $data['is_featured'] ?? false,
        ]);

        $imageCount = $data['image_count'] ?? 3;
        $keyword = ($data['breed'] ?? '') === 'N/A' ? 'chicken+feed' : 'rooster,gamecock';
        for ($i = 1; $i <= $imageCount; $i++) {
            $lock = self::$imageIndex++;
            ProductImage::create([
                'product_id' => $product->id,
                'path' => "https://loremflickr.com/640/640/{$keyword}?lock={$lock}",
                'alt' => "{$name} - Image {$i}",
                'sort_order' => $i,
            ]);
        }

        return $product;
    }

    private function seedFightingBreeds(Category $category): void
    {
        $products = [
            [
                'name' => 'Champion Kelso Rooster',
                'description' => 'A top-tier Kelso rooster from a champion bloodline. Known for exceptional speed, intelligence, and cutting ability. This 18-month-old cock has been professionally conditioned and is ring-ready.',
                'breed' => 'Kelso',
                'price' => 15000,
                'compare_price' => 18000,
                'stock' => 3,
                'age_months' => 18,
                'weight_kg' => 2.8,
                'color' => 'Red',
                'is_featured' => true,
            ],
            [
                'name' => 'Premium Hatch Stag',
                'description' => 'Pure Hatch bloodline with aggressive fighting style and powerful legs. This stag shows excellent promise with strong bone structure and natural gameness inherited from proven parents.',
                'breed' => 'Hatch',
                'price' => 12000,
                'stock' => 5,
                'age_months' => 14,
                'weight_kg' => 2.5,
                'color' => 'Dark Red',
            ],
            [
                'name' => 'Pure Sweater Cock',
                'description' => 'Authentic Sweater bloodline rooster known for devastating power and relentless fighting spirit. This 24-month cock is in peak condition with beautiful red-white plumage and muscular build.',
                'breed' => 'Sweater',
                'price' => 18000,
                'compare_price' => 22000,
                'stock' => 2,
                'age_months' => 24,
                'weight_kg' => 3.0,
                'color' => 'Red-White',
                'is_featured' => true,
            ],
            [
                'name' => 'Albany Game Fowl',
                'description' => 'Classic Albany game fowl with straight comb and lean build. Excellent cutter with fast reflexes. Well-conditioned and from a line known for consistency in the pit.',
                'breed' => 'Albany',
                'price' => 10000,
                'stock' => 4,
                'age_months' => 16,
                'weight_kg' => 2.6,
                'color' => 'Spangled',
            ],
            [
                'name' => 'Roundhead Battle Cock',
                'description' => 'Pure Roundhead rooster with the signature pea comb and compact body. Known for aerial attacks and exceptional stamina. This cock comes from a winning bloodline with documented victories.',
                'breed' => 'Roundhead',
                'price' => 14000,
                'stock' => 3,
                'age_months' => 20,
                'weight_kg' => 2.7,
                'color' => 'Dark Red',
                'is_featured' => true,
            ],
            [
                'name' => 'Claret Game Fowl',
                'description' => 'Beautiful Claret rooster with deep mahogany plumage. This breed is prized for its intelligence and ability to adapt mid-fight. Excellent cutting style with strong legs.',
                'breed' => 'Claret',
                'price' => 13000,
                'stock' => 4,
                'age_months' => 17,
                'weight_kg' => 2.6,
                'color' => 'Claret Red',
            ],
            [
                'name' => 'Lemon Hatch Fighter',
                'description' => 'Rare Lemon Hatch variant with distinctive yellow-red hackle feathers. Combines the power of Hatch with lighter, faster movements. Professionally raised and conditioned.',
                'breed' => 'Lemon Hatch',
                'price' => 16000,
                'stock' => 2,
                'age_months' => 19,
                'weight_kg' => 2.9,
                'color' => 'Lemon Red',
            ],
            [
                'name' => 'Butcher Game Cock',
                'description' => 'Powerful Butcher bloodline rooster with devastating single-stroke ability. Heavy-boned with thick legs and broad chest. A true finisher in the ring.',
                'breed' => 'Butcher',
                'price' => 11000,
                'stock' => 5,
                'age_months' => 15,
                'weight_kg' => 3.1,
                'color' => 'Black Red',
            ],
            [
                'name' => 'Grey Kelso Cross',
                'description' => 'Strategic cross between Grey and Kelso lines producing an intelligent fighter with excellent cutting ability. Shows the best traits of both breeds with consistent performance.',
                'breed' => 'Kelso Cross',
                'price' => 9500,
                'stock' => 6,
                'age_months' => 16,
                'weight_kg' => 2.7,
                'color' => 'Grey',
                'status' => 'draft',
            ],
            [
                'name' => 'Radio Stag Fighter',
                'description' => 'Radio bloodline known for explosive bursts of speed and unpredictable fighting patterns. This stag has been carefully raised with premium feed and supplements.',
                'breed' => 'Radio',
                'price' => 13500,
                'stock' => 3,
                'age_months' => 14,
                'weight_kg' => 2.4,
                'color' => 'Wheaten',
            ],
        ];

        foreach ($products as $product) {
            $this->createProduct($category, $product);
        }
    }

    private function seedOrnamentalBreeds(Category $category): void
    {
        $products = [
            [
                'name' => 'Silver Laced Polish Rooster',
                'description' => 'Stunning Silver Laced Polish rooster with an elaborate crest of feathers. A true showstopper at poultry exhibitions. Gentle temperament makes it ideal for display and breeding.',
                'breed' => 'Polish',
                'price' => 8000,
                'stock' => 6,
                'age_months' => 12,
                'weight_kg' => 2.0,
                'color' => 'Silver Laced',
            ],
            [
                'name' => 'Golden Sebright Bantam',
                'description' => 'Exquisite Golden Sebright bantam with perfectly laced golden feathers edged in black. One of the most ornamental true bantam breeds. Compact and elegant.',
                'breed' => 'Sebright',
                'price' => 5000,
                'stock' => 8,
                'age_months' => 10,
                'weight_kg' => 0.6,
                'color' => 'Golden',
                'is_featured' => true,
            ],
            [
                'name' => 'Blue Silkie Rooster',
                'description' => 'Fluffy Blue Silkie rooster with characteristic silk-like plumage, black skin, and five toes. Known for their calm and friendly disposition. Perfect for backyard flocks and shows.',
                'breed' => 'Silkie',
                'price' => 4500,
                'stock' => 10,
                'age_months' => 8,
                'weight_kg' => 1.5,
                'color' => 'Blue',
            ],
            [
                'name' => 'Phoenix Long Tail Rooster',
                'description' => 'Magnificent Phoenix rooster with flowing tail feathers reaching over 3 feet long. A descendant of the Japanese Onagadori breed. Requires special roosting arrangements for tail care.',
                'breed' => 'Phoenix',
                'price' => 12000,
                'compare_price' => 15000,
                'stock' => 2,
                'age_months' => 24,
                'weight_kg' => 2.3,
                'color' => 'Silver Duckwing',
                'is_featured' => true,
            ],
            [
                'name' => 'Black Sumatra Rooster',
                'description' => 'Elegant Black Sumatra with iridescent beetle-green sheen on its black plumage. Multiple spurs and a graceful carriage make this a prized ornamental breed from Indonesia.',
                'breed' => 'Sumatra',
                'price' => 7000,
                'stock' => 4,
                'age_months' => 14,
                'weight_kg' => 2.2,
                'color' => 'Black',
            ],
            [
                'name' => 'Mille Fleur d\'Uccle Bantam',
                'description' => 'Charming Mille Fleur d\'Uccle bantam with intricate feathering in mahogany, white, and black. Feathered feet and a sweet personality. A favorite at poultry shows worldwide.',
                'breed' => 'Belgian d\'Uccle',
                'price' => 3500,
                'stock' => 7,
                'age_months' => 9,
                'weight_kg' => 0.7,
                'color' => 'Mille Fleur',
            ],
            [
                'name' => 'Frizzle Cochin Rooster',
                'description' => 'Eye-catching Frizzle Cochin with uniquely curled feathers that give a wild, windblown appearance. Large, fluffy body with feathered legs. Gentle giant of the poultry world.',
                'breed' => 'Cochin Frizzle',
                'price' => 6000,
                'stock' => 5,
                'age_months' => 11,
                'weight_kg' => 3.5,
                'color' => 'Buff',
            ],
            [
                'name' => 'White Yokohama Rooster',
                'description' => 'Graceful White Yokohama with a walnut comb and long, flowing saddle and tail feathers. Originally bred in Germany from Japanese long-tailed fowl. A showpiece breed.',
                'breed' => 'Yokohama',
                'price' => 9000,
                'stock' => 3,
                'age_months' => 18,
                'weight_kg' => 2.0,
                'color' => 'White',
                'status' => 'draft',
            ],
        ];

        foreach ($products as $product) {
            $this->createProduct($category, $product);
        }
    }

    private function seedBreedingStock(Category $category): void
    {
        $products = [
            [
                'name' => 'Proven Kelso Brood Cock',
                'description' => 'Battle-tested Kelso brood cock with a documented winning record. Produces consistently high-quality offspring with excellent fighting traits. Limited availability — serious breeders only.',
                'breed' => 'Kelso',
                'price' => 25000,
                'compare_price' => 30000,
                'stock' => 1,
                'age_months' => 36,
                'weight_kg' => 3.2,
                'color' => 'Red',
                'is_featured' => true,
            ],
            [
                'name' => 'Sweater Brood Stag',
                'description' => 'Premium Sweater brood stag from a champion lineage. His offspring consistently show power and gameness. Comes with full pedigree documentation and breeding history.',
                'breed' => 'Sweater',
                'price' => 22000,
                'stock' => 2,
                'age_months' => 30,
                'weight_kg' => 3.0,
                'color' => 'Red-White',
            ],
            [
                'name' => 'Hatch Breeding Pair',
                'description' => 'Matched Hatch breeding pair — one proven brood cock and one quality hen. Known for producing stags with heavy bone structure and natural aggression. Excellent genetic combination.',
                'breed' => 'Hatch',
                'price' => 35000,
                'stock' => 1,
                'age_months' => 28,
                'weight_kg' => 3.1,
                'color' => 'Dark Red',
                'is_featured' => true,
            ],
            [
                'name' => 'Roundhead Brood Cock',
                'description' => 'Pure Roundhead brood cock with exceptional pedigree. Sired multiple winning offspring across different farms. Ideal for breeders looking to establish or strengthen Roundhead lines.',
                'breed' => 'Roundhead',
                'price' => 20000,
                'stock' => 2,
                'age_months' => 32,
                'weight_kg' => 2.9,
                'color' => 'Dark Red',
            ],
            [
                'name' => 'Albany Brood Cock Select',
                'description' => 'Hand-selected Albany brood cock with straight comb and ideal body conformation. Offspring are known for consistent cutting ability and fast maturation. Full breeding records available.',
                'breed' => 'Albany',
                'price' => 18000,
                'stock' => 2,
                'age_months' => 34,
                'weight_kg' => 2.8,
                'color' => 'Spangled',
            ],
            [
                'name' => 'Claret Breeding Trio',
                'description' => 'One Claret brood cock paired with two quality hens. This trio has produced multiple show-winning offspring. A complete starter package for serious Claret breeders.',
                'breed' => 'Claret',
                'price' => 40000,
                'compare_price' => 48000,
                'stock' => 1,
                'age_months' => 26,
                'weight_kg' => 2.7,
                'color' => 'Claret Red',
                'is_featured' => true,
                'status' => 'sold',
            ],
            [
                'name' => 'Asil Heritage Brood Cock',
                'description' => 'Imported Asil heritage brood cock with pure bloodline tracing back to Indian origins. Tall, muscular build with upright stance. Ideal for crossing with game fowl for added power.',
                'breed' => 'Asil',
                'price' => 28000,
                'stock' => 1,
                'age_months' => 40,
                'weight_kg' => 3.5,
                'color' => 'Wheaten',
            ],
        ];

        foreach ($products as $product) {
            $this->createProduct($category, $product);
        }
    }

    private function seedRareBreeds(Category $category): void
    {
        $products = [
            [
                'name' => 'Ayam Cemani Black Rooster',
                'description' => 'The legendary Ayam Cemani — completely black from feathers to bones, organs, and even blood. Originating from Java, Indonesia, this hyperpigmented breed is one of the rarest in the world.',
                'breed' => 'Ayam Cemani',
                'price' => 35000,
                'compare_price' => 45000,
                'stock' => 2,
                'age_months' => 14,
                'weight_kg' => 2.0,
                'color' => 'All Black',
                'is_featured' => true,
            ],
            [
                'name' => 'Dong Tao Dragon Leg Rooster',
                'description' => 'Extremely rare Vietnamese Dong Tao rooster with massive, scaly legs resembling dragon claws. Once reserved for royalty and special ceremonies. A true collector piece.',
                'breed' => 'Dong Tao',
                'price' => 50000,
                'stock' => 1,
                'age_months' => 20,
                'weight_kg' => 5.0,
                'color' => 'White-Red',
                'is_featured' => true,
            ],
            [
                'name' => 'Onagadori Long Tail Rooster',
                'description' => 'Authentic Japanese Onagadori with non-molting tail feathers that can grow over 10 feet long. One of the most ancient and revered ornamental breeds in Japan. Extremely rare outside Asia.',
                'breed' => 'Onagadori',
                'price' => 45000,
                'stock' => 1,
                'age_months' => 30,
                'weight_kg' => 1.8,
                'color' => 'White',
                'status' => 'sold',
            ],
            [
                'name' => 'Ga Noi Vietnamese Fighter',
                'description' => 'Traditional Vietnamese Ga Noi fighting rooster. Tall, muscular, and nearly featherless on the neck and chest. A rare heritage breed prized for its strength and endurance.',
                'breed' => 'Ga Noi',
                'price' => 20000,
                'stock' => 3,
                'age_months' => 22,
                'weight_kg' => 4.0,
                'color' => 'Black Red',
            ],
            [
                'name' => 'Shamo Japanese Game Fowl',
                'description' => 'Tall and powerful Japanese Shamo game fowl with upright posture and muscular build. One of the tallest chicken breeds, standing over 75cm. Imported bloodline with registration papers.',
                'breed' => 'Shamo',
                'price' => 18000,
                'stock' => 2,
                'age_months' => 18,
                'weight_kg' => 4.5,
                'color' => 'Black Breasted Red',
            ],
            [
                'name' => 'Liege Fighter Belgian Giant',
                'description' => 'Massive Liege Fighter from Belgium, one of the largest game fowl breeds. Can weigh up to 6kg with a powerful build. Extremely rare in the Philippines — limited import availability.',
                'breed' => 'Liege Fighter',
                'price' => 30000,
                'stock' => 1,
                'age_months' => 24,
                'weight_kg' => 5.5,
                'color' => 'Dark Red',
                'is_featured' => true,
            ],
        ];

        foreach ($products as $product) {
            $this->createProduct($category, $product);
        }
    }

    private function seedYoungStags(Category $category): void
    {
        $products = [
            [
                'name' => 'Young Kelso Stag',
                'description' => 'Promising young Kelso stag at 6 months old. Already showing excellent body conformation and alertness typical of champion Kelso lines. Perfect for raising and training.',
                'breed' => 'Kelso',
                'price' => 5000,
                'stock' => 10,
                'age_months' => 6,
                'weight_kg' => 1.5,
                'color' => 'Red',
            ],
            [
                'name' => 'Hatch Pullet Stag',
                'description' => 'Young Hatch stag showing early signs of the breed\'s characteristic power and bone density. At 8 months, he is developing well and ready for further conditioning.',
                'breed' => 'Hatch',
                'price' => 6000,
                'stock' => 8,
                'age_months' => 8,
                'weight_kg' => 1.8,
                'color' => 'Dark Red',
            ],
            [
                'name' => 'Sweater Junior Stag',
                'description' => 'Well-bred Sweater stag from proven parents. At 7 months, already displaying the energy and build characteristic of top Sweater lines. Vaccinated and dewormed.',
                'breed' => 'Sweater',
                'price' => 5500,
                'stock' => 7,
                'age_months' => 7,
                'weight_kg' => 1.6,
                'color' => 'Red-White',
            ],
            [
                'name' => 'Roundhead Young Blood',
                'description' => 'Athletic young Roundhead stag with pea comb developing nicely. Shows natural gameness and alertness. From a line known for producing consistent winners.',
                'breed' => 'Roundhead',
                'price' => 5500,
                'stock' => 6,
                'age_months' => 9,
                'weight_kg' => 1.9,
                'color' => 'Dark Red',
            ],
            [
                'name' => 'Albany Starter Stag',
                'description' => 'Young Albany stag ideal for beginners or experienced breeders looking to add Albany genetics. Good temperament with classic breed characteristics showing through.',
                'breed' => 'Albany',
                'price' => 4500,
                'stock' => 9,
                'age_months' => 5,
                'weight_kg' => 1.3,
                'color' => 'Spangled',
            ],
            [
                'name' => 'Lemon Hatch Young Stag',
                'description' => 'Rare Lemon Hatch young stag with the distinctive yellow-red hackle already coming in. Fast-growing with strong legs and excellent appetite. A future champion in the making.',
                'breed' => 'Lemon Hatch',
                'price' => 7000,
                'stock' => 4,
                'age_months' => 10,
                'weight_kg' => 2.0,
                'color' => 'Lemon Red',
            ],
            [
                'name' => 'Asil Heritage Stag',
                'description' => 'Young Asil stag imported from a heritage line. Already standing tall with the breed\'s characteristic upright posture. Slow-maturing breed that rewards patient rearing.',
                'breed' => 'Asil',
                'price' => 8000,
                'stock' => 3,
                'age_months' => 11,
                'weight_kg' => 2.2,
                'color' => 'Wheaten',
                'status' => 'draft',
            ],
            [
                'name' => 'Mixed Stag Bundle (3 pcs)',
                'description' => 'Bundle of three young stags from mixed bloodlines — ideal for hobbyists or new breeders. Breeds may include Kelso, Hatch, or Sweater crosses. Great value starter pack.',
                'breed' => 'Mixed',
                'price' => 10000,
                'compare_price' => 15000,
                'stock' => 5,
                'age_months' => 6,
                'weight_kg' => 1.5,
                'color' => 'Assorted',
                'is_featured' => true,
            ],
        ];

        foreach ($products as $product) {
            $this->createProduct($category, $product);
        }
    }

    private function seedSupplies(Category $category): void
    {
        $products = [
            [
                'name' => 'Premium Game Fowl Feed 25kg',
                'description' => 'High-protein game fowl feed formulated specifically for fighting and breeding roosters. Contains 22% crude protein with essential amino acids for muscle development and feather quality.',
                'breed' => 'N/A',
                'price' => 1200,
                'stock' => 50,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Rooster Vitamins Pack',
                'description' => 'Complete vitamin and mineral supplement pack for game fowl. Includes Vitamins A, D3, E, K, and B-complex. Boosts immunity, feather growth, and overall vitality. 30-day supply.',
                'breed' => 'N/A',
                'price' => 450,
                'stock' => 100,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Electrolyte Powder 500g',
                'description' => 'Fast-acting electrolyte powder to keep roosters hydrated and energized. Essential for recovery after conditioning and during hot weather. Mix with drinking water daily.',
                'breed' => 'N/A',
                'price' => 350,
                'stock' => 75,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Iron Supplement Drops 100ml',
                'description' => 'Concentrated iron supplement drops for game fowl. Supports blood health and oxygen delivery to muscles. Administer directly or mix with feed. Veterinarian-recommended formula.',
                'breed' => 'N/A',
                'price' => 280,
                'stock' => 60,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Anti-Parasitic Dewormer 250ml',
                'description' => 'Broad-spectrum liquid dewormer effective against roundworms, tapeworms, and other internal parasites. Safe for all ages of game fowl. Easy oral administration with included dropper.',
                'breed' => 'N/A',
                'price' => 520,
                'stock' => 40,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Wound Care Spray 200ml',
                'description' => 'Antiseptic wound care spray for treating cuts, scratches, and minor injuries. Contains chlorhexidine and aloe vera for fast healing. Essential first aid for any game fowl keeper.',
                'breed' => 'N/A',
                'price' => 380,
                'stock' => 55,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Conditioning Powder 1kg',
                'description' => 'Professional-grade conditioning powder to build muscle mass and stamina. Blend of creatine, protein isolate, and B-vitamins. Used by top breeders for pre-competition preparation.',
                'breed' => 'N/A',
                'price' => 800,
                'stock' => 30,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
                'is_featured' => true,
            ],
            [
                'name' => 'Leg Band Set (50 pcs)',
                'description' => 'Color-coded aluminum leg bands for identifying and tracking roosters. Set of 50 in assorted colors with numbered markings. Adjustable snap-on design fits all standard game fowl sizes.',
                'breed' => 'N/A',
                'price' => 250,
                'stock' => 80,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Rooster Transport Cage',
                'description' => 'Durable plastic transport cage designed specifically for game fowl. Ventilated sides with secure latch. Lightweight and easy to clean. Fits one adult rooster comfortably.',
                'breed' => 'N/A',
                'price' => 1500,
                'stock' => 20,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
            [
                'name' => 'Scratch Grain Mix 10kg',
                'description' => 'Natural scratch grain mix with cracked corn, wheat, milo, and sunflower seeds. Perfect as a supplementary feed to encourage natural foraging behavior and keep roosters active.',
                'breed' => 'N/A',
                'price' => 650,
                'stock' => 45,
                'color' => null,
                'age_months' => null,
                'weight_kg' => null,
            ],
        ];

        foreach ($products as $product) {
            $this->createProduct($category, $product);
        }
    }
}
