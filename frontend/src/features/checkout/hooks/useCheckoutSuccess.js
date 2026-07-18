import { useQuery } from '@tanstack/react-query';
import { getCheckoutSuccess } from '@/features/checkout/api/checkout.service';

export function useCheckoutSuccess(orderId, sessionId) {
  return useQuery({
    queryKey: ['checkout-success', orderId, sessionId],
    queryFn: () => getCheckoutSuccess(orderId, sessionId),
    enabled: Boolean(orderId),
    retry: false,
  });
}
