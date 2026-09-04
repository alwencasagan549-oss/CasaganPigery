<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_records', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('pig_id')->constrained('pigs')->onDelete('cascade');
            $blueprint->string('type'); // Vaccination, Medication, Deworming, Checkup
            $blueprint->date('date');
            $blueprint->text('description');
            $blueprint->text('remarks')->nullable();
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_records');
    }
};
