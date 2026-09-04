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
        Schema::dropIfExists('weaning_records');
        Schema::create('weaning_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pig_id')->constrained('pigs')->onDelete('cascade');
            $table->date('farrowing_date');
            $table->date('expected_weaning_date');
            $table->date('actual_weaning_date')->nullable();
            $table->string('status')->default('Active'); // Active, Completed
            $table->integer('litter_size')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weaning_records');
    }
};
