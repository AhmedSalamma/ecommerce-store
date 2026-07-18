import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCheckoutSuccess } from '@/features/checkout/hooks/useCheckoutSuccess';
import { queryKeys } from '@/api/queryKeys';

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useCheckoutSuccess(orderId, sessionId);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart });
  }, [queryClient]);

  const isPaid = data?.order?.payment_status === 'paid';

  return (
    <div className="container-custom flex flex-col items-center justify-center gap-3 py-24 text-center">
      {isLoading && <p className="text-sm text-neutral-500">جارِ التأكيد...</p>}

      {isError && <p className="text-sm text-red-600">تعذر التحقق من حالة الطلب</p>}

      {data && (
        <>
          {isPaid ? (
            <CheckCircle2 size={48} className="text-green-500" />
          ) : (
            <Clock size={48} className="text-amber-500" />
          )}
          <h1 className="text-2xl font-extrabold text-neutral-900">{data.message}</h1>
          {data.order?.order_number && (
            <p className="text-sm text-neutral-500">رقم الطلب: {data.order.order_number}</p>
          )}
        </>
      )}

      <div className="mt-2 flex gap-3">
        {orderId && (
          <Button as={Link} to={`/orders/${orderId}`} size="sm">
            عرض تفاصيل الطلب
          </Button>
        )}
        <Button as={Link} to="/" variant="outline" size="sm">
          العودة إلى الرئيسية
        </Button>
      </div>
    </div>
  );
}
