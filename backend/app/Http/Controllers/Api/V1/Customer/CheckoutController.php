<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function __construct(public CheckoutService $checkoutService) {}

    public function checkout(OrderRequest $request)
    {
        $order = $this->checkoutService->process($request->address_id, $request->notes);

        return response()->json([
            'message' => 'تم إنشاء الطلب بنجاح.',
            'data' => $order,
        ], 201);
    }

    public function success(Order $order, Request $request)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $sessionId = $request->query('session_id');

        if ($order->payment_status === PaymentStatus::UNPAID->value && $sessionId) {
            $this->checkoutService->reconcile($order, $sessionId);
            $order->refresh();
        }

        return response()->json([
            'message' => $order->payment_status === PaymentStatus::PAID->value
                ? 'تم الدفع بنجاح.'
                : 'الدفع قيد المعالجة، سيتم تأكيد الطلب فور استلام الدفع.',
            'order' => $order,
        ], 200);
    }

    public function cancel()
    {
        return response()->json([
            'message' => 'تم إلغاء الدفع.',
        ], 200);
    }
}
