import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useOrders } from '@/features/orders/hooks/useOrders';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const STATUS_VARIANTS = {
  pending: 'outline',
  processing: 'new',
  shipped: 'dark',
  delivered: 'dark',
  completed: 'dark',
  cancelled: 'sale',
};

export function OrdersPage() {
  const { data, isLoading, isError } = useOrders();
  const orders = data?.orders ?? [];

  return (
    <div className="container-custom py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-neutral-900">طلباتي</h1>

      {isLoading && <p className="text-sm text-neutral-500">جارِ التحميل...</p>}
      {isError && <p className="text-sm text-red-600">تعذر تحميل الطلبات</p>}

      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-sm font-semibold text-neutral-700">لا توجد طلبات بعد</p>
          <Button as={Link} to="/shop" size="sm">
            تصفح المنتجات
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <p className="font-bold text-neutral-900">{order.order_number}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {new Date(order.created_at).toLocaleDateString('ar-EG')}
              </p>
            </div>
            <Badge variant={STATUS_VARIANTS[order.status] ?? 'outline'}>
              {STATUS_LABELS[order.status] ?? order.status}
            </Badge>
            <span className="text-base font-extrabold text-neutral-900">
              {Number(order.total).toLocaleString()}$
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
