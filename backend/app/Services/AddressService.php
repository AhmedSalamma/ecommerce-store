<?php

namespace App\Services;

use App\Exceptions\Checkout\AddressNotFoundException;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressService
{
    public function getUserAddresses()
    {
        return Auth::user()->addresses()->paginate(5);
    }

    public function getOrderAddress(int $addressId): Address{
        $address = Auth::user()->addresses()->find($addressId);

        if (!$address) {
            throw new AddressNotFoundException('العنوان غير موجود.');
        }

        return $address;
    }

    
}