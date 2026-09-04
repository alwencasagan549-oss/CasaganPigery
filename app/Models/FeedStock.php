<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedStock extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'qty_sacks', 'min_threshold', 'last_delivery', 'price_per_sack'];
}
