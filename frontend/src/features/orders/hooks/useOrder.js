import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getOrder } from '@/features/orders/api/order.service';

export function useOrder(id) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}
