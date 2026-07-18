<?php

namespace App\Services\Payment\Contracts;

use App\Models\Order;

interface PaymentInterface
{
    public function pay(Order $order);
}
