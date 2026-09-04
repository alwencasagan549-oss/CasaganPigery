<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'pig_id', 'qty', 'total_price', 'sale_date', 'payment_method'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function pig()
    {
        return $this->belongsTo(Pig::class);
    }
}
