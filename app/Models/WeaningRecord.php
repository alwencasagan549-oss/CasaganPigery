<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeaningRecord extends Model
{
    protected $fillable = [
        'pig_id',
        'farrowing_date',
        'expected_weaning_date',
        'actual_weaning_date',
        'status',
        'litter_size',
    ];

    public function pig()
    {
        return $this->belongsTo(Pig::class);
    }
}
