<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Auth::user()->addresses;

        return response()->json([
            'data' => AddressResource::collection($addresses),
            'message' => 'تم جلب العناوين بنجاح',
        ]);
    }

    public function store(AddressRequest $request)
    {
        $address = Auth::user()->addresses()->create($request->validated());

        return response()->json([
            'data' => AddressResource::make($address),
            'message' => 'تم إضافة العنوان بنجاح',
        ], 201);
    }

    public function destroy(Address $address)
    {
        abort_unless($address->user_id === Auth::id(), 403);

        $address->delete();

        return response()->json([
            'message' => 'تم حذف العنوان بنجاح',
        ]);
    }
}
