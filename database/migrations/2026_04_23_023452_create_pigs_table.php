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
        Schema::create('pigs', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['inahin', 'platining', 'biik']);
            $table->enum('gender', ['Male', 'Female']);
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('qty')->default(1);
            $table->enum('status', ['For Sale', 'Sold'])->default('For Sale');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pigs');
    }
};
