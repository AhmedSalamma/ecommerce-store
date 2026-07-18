<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function stats()
    {
        $paidOrders = Order::query()->where('payment_status', PaymentStatus::PAID->value);

        $recentOrders = Order::query()
            ->with('user:id,name,email')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user?->name,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total' => $order->total,
                'created_at' => $order->created_at,
            ]);

        return response()->json([
            'data' => [
                'products_count' => Product::query()->count(),
                'users_count' => User::query()->count(),
                'categories_count' => Category::query()->count(),
                'orders_count' => Order::query()->count(),
                'today_sales' => (clone $paidOrders)->whereDate('paid_at', today())->sum('total'),
                'today_orders_count' => (clone $paidOrders)->whereDate('paid_at', today())->count(),
                'total_sales' => (clone $paidOrders)->sum('total'),
                'recent_orders' => $recentOrders,
            ],
            'message' => 'تم جلب الإحصائيات بنجاح',
        ]);
    }
}
