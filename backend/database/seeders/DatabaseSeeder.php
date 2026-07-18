<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ShippingPrice;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
        ]);

        $categories = collect([
            ['slug' => 'phones', 'name' => 'الهواتف الذكية'],
            ['slug' => 'laptops', 'name' => 'أجهزة كمبيوتر محمولة'],
            ['slug' => 'tablets', 'name' => 'الأجهزة اللوحية'],
            ['slug' => 'games', 'name' => 'الألعاب'],
            ['slug' => 'audio', 'name' => 'الصوتيات'],
            ['slug' => 'accessories', 'name' => 'الإكسسوارات'],
            ['slug' => 'cameras', 'name' => 'الكاميرات'],
            ['slug' => 'watches', 'name' => 'الساعات الذكية'],
        ])->map(fn ($category) => Category::factory()->create($category));

        $brands = collect(['Aether', 'Orbital', 'Kanto', 'Volt', 'Nimbus', 'Forge'])
            ->map(fn ($name) => Brand::factory()->create(['name' => $name, 'slug' => Str::slug($name)]));

        $categories->each(function (Category $category) use ($brands, $user) {
            Product::factory()
                ->count(random_int(4, 6))
                ->create([
                    'category_id' => $category->id,
                    'brand_id' => fn () => $brands->random()->id,
                    'user_id' => $user->id,
                ]);
        });

        collect([
            ['area_name' => 'القاهرة', 'price' => 50],
            ['area_name' => 'الجيزة', 'price' => 50],
            ['area_name' => 'الإسكندرية', 'price' => 70],
            ['area_name' => 'أسوان', 'price' => 120],
            ['area_name' => 'الأقصر', 'price' => 120],
        ])->each(fn ($row) => ShippingPrice::create($row));
    }
}
