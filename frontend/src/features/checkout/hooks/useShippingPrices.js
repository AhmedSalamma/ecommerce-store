import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getShippingPrices } from '@/features/checkout/api/shipping.service';

export function useShippingPrices() {
  return useQuery({
    queryKey: queryKeys.shippingPrices,
    queryFn: getShippingPrices,
    staleTime: 5 * 60 * 1000,
  });
}
