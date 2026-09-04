<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pig extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'gender',
        'price',
        'qty',
        'status',
        'notes',
    ];
}
