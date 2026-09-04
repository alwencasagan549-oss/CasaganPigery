<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BreedingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'pig_id',
        'service_date',
        'expected_farrowing_date',
        'actual_farrowing_date',
        'status',
        'litter_size',
    ];

    public function pig()
    {
        return $this->belongsTo(Pig::class);
    }
}
