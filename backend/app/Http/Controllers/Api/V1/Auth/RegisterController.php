<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Events\UserRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Exception;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request)
    {

        try {
            $user = User::create([...$request->validated(), 'role' => 'user']);
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['data' => UserResource::make($user), 'message' => 'تم التسجيل بنجاح', 'token' => $token], 201);
            event(new UserRegistered($user));
        } catch (Exception $e) {
            return response()->json(['message' => 'حدثت مشكله أثناء التسجيل.'], 500);

        }

    }
}
