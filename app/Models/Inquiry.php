<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'pig_id',
        'fb_id',
        'fb_profile_pic',
        'customer_name',
        'phone',
        'address',
        'qty',
        'message',
        'status',
    ];

    public function pig()
    {
        return $this->belongsTo(Pig::class);
    }
}
