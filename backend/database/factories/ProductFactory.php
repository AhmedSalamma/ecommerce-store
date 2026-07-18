<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->words(3, true);
        $price = fake()->numberBetween(50, 2000);
        $onSale = fake()->boolean(30);

        return [
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'user_id' => User::factory(),
            'title' => ucfirst($title),
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->paragraph(),
            'price' => $price,
            'old_price' => $onSale ? $price + fake()->numberBetween(20, 400) : null,
            'stock' => fake()->numberBetween(0, 80),
            'color' => fake()->randomElement(['red', 'graphite', 'cream', 'blue', 'silver', 'black']),
            'storage' => fake()->randomElement(['128GB', '256GB', '512GB', '1TB', null]),
            'rating' => fake()->numberBetween(3, 5),
            'reviews_count' => fake()->numberBetween(5, 400),
            'badge' => fake()->randomElement(['جديد', 'اختيار المحررين', null, null]),
            'is_featured' => fake()->boolean(20),
            'sales_count' => fake()->numberBetween(0, 500),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
