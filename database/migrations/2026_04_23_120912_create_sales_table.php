<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('set null');
            $blueprint->foreignId('pig_id')->constrained('pigs')->onDelete('cascade');
            $blueprint->integer('qty');
            $blueprint->decimal('total_price', 12, 2);
            $blueprint->date('sale_date');
            $blueprint->string('payment_method')->default('Cash');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
