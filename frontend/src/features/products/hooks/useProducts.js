import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getProducts } from '@/features/products/api/product.service';

export function useProducts(params = {}, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}
