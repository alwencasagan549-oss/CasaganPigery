<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_stocks', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('name'); // Starter, Grower, Finisher, etc.
            $blueprint->integer('qty_sacks')->default(0);
            $blueprint->integer('min_threshold')->default(10);
            $blueprint->date('last_delivery')->nullable();
            $blueprint->decimal('price_per_sack', 10, 2)->nullable();
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_stocks');
    }
};
