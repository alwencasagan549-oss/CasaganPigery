<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthRecord extends Model
{
    use HasFactory;

    protected $fillable = ['pig_id', 'type', 'date', 'description', 'remarks'];

    public function pig()
    {
        return $this->belongsTo(Pig::class);
    }
}
