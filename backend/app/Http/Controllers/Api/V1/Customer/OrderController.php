<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function index()
    {
        return OrderResource::collection(
            $this->orderService->getUserOrders()
        );
    }

    public function show(int $orderId)
    {
        $order = $this->orderService->getOrderById($orderId);

        if (! $order) {
            return response()->json([
                'message' => 'الطلب غير موجود',
            ], 404);
        }

        return OrderResource::make($order);
    }

    public function userOrders()
    {
        return OrderResource::collection(
            $this->orderService->getUserOrders()
        );
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'غير مصرح لك بهذا الإجراء',
            ], 403);
        }

        if ($order->status !== OrderStatus::PENDING->value) {
            return response()->json([
                'message' => 'لا يمكن إلغاء الطلب بعد تأكيده',
            ], 400);
        }

        $this->orderService->cancelAndRestock($order);

        return response()->json([
            'message' => 'تم إلغاء الطلب بنجاح',
        ], 200);
    }
}
