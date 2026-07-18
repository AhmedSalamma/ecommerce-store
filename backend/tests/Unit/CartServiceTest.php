<?php

namespace Tests\Unit;

use App\Exceptions\Checkout\CartIsEmptyException;
use App\Services\CartService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class CartServiceTest extends TestCase
{
    public function test_get_user_cart_requires_authenticated_user(): void
    {
        Auth::shouldReceive('user')->once()->andReturn(null);

        $this->expectException(AuthenticationException::class);

        (new CartService())->getUserCart();
    }
}
