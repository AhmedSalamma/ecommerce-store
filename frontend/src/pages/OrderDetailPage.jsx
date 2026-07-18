import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import { useOrder } from '@/features/orders/hooks/useOrder';
import { useCancelOrder } from '@/features/orders/hooks/useCancelOrder';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrder(id);
  const cancelMutation = useCancelOrder();

  if (isLoading) {
    return <div className="container-custom py-24 text-center text-sm text-neutral-500">جارِ التحميل...</div>;
  }

  if (isError || !order) {
    return (
      <div className="container-custom flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-lg font-bold text-neutral-900">لم يتم العثور على هذا الطلب</p>
        <Button onClick={() => navigate('/orders')} size="sm">
          العودة إلى طلباتي
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-neutral-500">
        <Link to="/orders" className="hover:text-neutral-700">
          طلباتي
        </Link>
        <ChevronLeft size={12} />
        <span className="text-neutral-700">{order.order_number}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">{order.order_number}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {new Date(order.created_at).toLocaleDateString('ar-EG')}
          </p>
        </div>
        <Badge variant="outline">{STATUS_LABELS[order.status] ?? order.status}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
              <ProductImage imageUrl={item.product.image} className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900">{item.product.title}</p>
                <p className="text-xs text-neutral-400">الكمية: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-neutral-900">{Number(item.subtotal).toLocaleString()}$</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-neutral-50 p-5">
            <h2 className="mb-3 text-sm font-bold text-neutral-900">عنوان الشحن</h2>
            {order.address ? (
              <div className="text-sm text-neutral-600">
                <p className="font-semibold text-neutral-900">{order.address.full_name}</p>
                <p className="mt-1">
                  {order.address.street}، {order.address.city}، {order.address.country}
                </p>
                <p>{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">لا يوجد عنوان</p>
            )}
          </div>

          <div className="space-y-2 rounded-2xl bg-neutral-50 p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">المجموع الفرعي</span>
              <span className="font-semibold text-neutral-900">{Number(order.subtotal).toLocaleString()}$</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">الشحن</span>
              <span className="font-semibold text-neutral-900">{Number(order.shipping_cost).toLocaleString()}$</span>
            </div>
            <div className="my-2 border-t border-neutral-200" />
            <div className="flex justify-between text-base font-extrabold text-neutral-900">
              <span>الإجمالي</span>
              <span>{Number(order.total).toLocaleString()}$</span>
            </div>
          </div>

          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => cancelMutation.mutate(order.id)}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'جارِ الإلغاء...' : 'إلغاء الطلب'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
