import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getOrders } from '@/features/orders/api/order.service';

export function useOrders(params = {}) {
  return useQuery({
    queryKey: queryKeys.orders(params),
    queryFn: () => getOrders(params),
  });
}
