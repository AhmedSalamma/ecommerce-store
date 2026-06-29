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
        Schema::create('addresses', function (Blueprint $table) {
          $table->id();
          $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
          $table->string('full_name');
          $table->string('phone');
          $table->string('country');
          $table->string('city');
          $table->string('state')->nullable();
          $table->string('street');
          $table->text('notes')->nullable();
          $table->enum('type',['home','work'])->default('home');
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
