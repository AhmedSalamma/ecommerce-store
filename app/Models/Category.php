<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'image',
        'description',
        'is_active',
    ];

    public function categories(){
        return $this->hasMany(Category::class);
    }

    public function images()
    {
    return $this->morphMany(Image::class, 'imageable');
    }
}
