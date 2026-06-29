<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }

    public function create(User $user):bool {
        return $user->role === 'admin';
            
    }

    public function update(User $user, Product $product): bool{
        return $product->user->id === $user->id;
    }

    public function delete(User $user, Product $product ): bool{

        return $user->role === 'admin' ||  $product->user->id === $user->id;

    }
}
