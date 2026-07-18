<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('brand_id')->nullable()->after('category_id')->constrained('brands')->nullOnDelete();
            $table->string('color')->nullable()->after('description');
            $table->string('storage')->nullable()->after('color');
            $table->unsignedTinyInteger('rating')->default(0)->after('stock');
            $table->unsignedInteger('reviews_count')->default(0)->after('rating');
            $table->unsignedInteger('old_price')->nullable()->after('price');
            $table->string('badge')->nullable()->after('reviews_count');
            $table->boolean('is_featured')->default(false)->after('badge');
            $table->unsignedInteger('sales_count')->default(0)->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('brand_id');
            $table->dropColumn([
                'color',
                'storage',
                'rating',
                'reviews_count',
                'old_price',
                'badge',
                'is_featured',
                'sales_count',
            ]);
        });
    }
};
