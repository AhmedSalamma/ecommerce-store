<?php

namespace App\Policies;

use App\Models\CartItem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CartPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function delete(User $user, CartItem $cartItem): bool {
        return $cartItem->cart->user_id === $user->id;
    }
}
