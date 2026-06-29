<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(LoginRequest $request)
    {

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
             'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'data'=>UserResource::make($user),
            'token'=> $user->createToken('login-token')->plainTextToken,
            'message'=>'تم تسجيل الدخول بنجاح']
            ,200);
        
    }
}
