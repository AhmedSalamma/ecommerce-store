<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserStoreRequest;
use App\Http\Requests\Admin\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->withCount('orders', 'products')
            ->when($request->string('search')->toString(), fn ($q, $search) => $q->where(fn ($q) => $q
                ->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%")
            ))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return UserResource::collection($users)->additional([
            'message' => 'تم جلب المستخدمين بنجاح',
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make($request->validated('password')),
        ]);

        return response()->json([
            'data' => UserResource::make($user),
            'message' => 'تم إضافة المستخدم بنجاح',
        ], 201);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        if ($user->id === $request->user()->id && $data['role'] !== 'admin') {
            abort(422, 'لا يمكنك إزالة صلاحية المدير عن حسابك الحالي.');
        }

        $user->update($data);

        return response()->json([
            'data' => UserResource::make($user),
            'message' => 'تم تحديث المستخدم بنجاح',
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            abort(422, 'لا يمكنك حذف حسابك الحالي.');
        }

        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح',
        ]);
    }
}
