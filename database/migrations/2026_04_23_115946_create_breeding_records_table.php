<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('breeding_records', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('pig_id')->constrained('pigs')->onDelete('cascade');
            $blueprint->date('service_date');
            $blueprint->date('expected_farrowing_date');
            $blueprint->date('actual_farrowing_date')->nullable();
            $blueprint->string('status')->default('Active'); // Active, Farrowed, Failed, Weaned
            $blueprint->integer('litter_size')->nullable();
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('breeding_records');
    }
};
