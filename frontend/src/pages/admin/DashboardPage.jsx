import { Package, Users, Tags, ShoppingBag, TrendingUp, CalendarClock } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminStats } from '@/features/admin/hooks/useAdminStats';

const STATUS_LABELS = {
  pending: 'قيد الانتظار',
  processing: 'قيد التجهيز',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

export function DashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return <p className="text-sm text-red-500">تعذر تحميل الإحصائيات، حاول مرة أخرى.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="المنتجات" value={stats.products_count} icon={Package} />
        <StatCard
          label="المستخدمون"
          value={stats.users_count}
          icon={Users}
          accent="bg-secondary/10 text-secondary"
        />
        <StatCard label="الفئات" value={stats.categories_count} icon={Tags} accent="bg-accent/10 text-accent" />
        <StatCard
          label="إجمالي الطلبات"
          value={stats.orders_count}
          icon={ShoppingBag}
          accent="bg-neutral-900/10 text-neutral-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="مبيعات اليوم"
          value={`${Number(stats.today_sales).toLocaleString()}$`}
          icon={CalendarClock}
          accent="bg-primary/10 text-primary"
        />
        <StatCard
          label="إجمالي المبيعات"
          value={`${Number(stats.total_sales).toLocaleString()}$`}
          icon={TrendingUp}
          accent="bg-secondary/10 text-secondary"
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-base font-bold text-neutral-900">أحدث الطلبات</h2>

        {stats.recent_orders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">لا توجد طلبات بعد.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-2 font-medium">رقم الطلب</th>
                  <th className="pb-2 font-medium">العميل</th>
                  <th className="pb-2 font-medium">الحالة</th>
                  <th className="pb-2 font-medium">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 font-medium text-neutral-900">{order.order_number}</td>
                    <td className="py-2.5 text-neutral-600">{order.customer ?? '—'}</td>
                    <td className="py-2.5 text-neutral-600">{STATUS_LABELS[order.status] ?? order.status}</td>
                    <td className="py-2.5 font-semibold text-neutral-900">
                      {Number(order.total).toLocaleString()}$
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
