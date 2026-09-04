<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'password', 'contact', 'address', 'total_purchases'];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
