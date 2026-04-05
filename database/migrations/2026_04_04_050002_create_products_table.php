<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('category_id')->constrained('categories');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('breed');
            $table->integer('age_months')->nullable();
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->string('color')->nullable();
            $table->enum('status', ['active', 'draft', 'sold'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('category_id');
            $table->index('status');
            $table->index('is_featured');
            $table->index('breed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
