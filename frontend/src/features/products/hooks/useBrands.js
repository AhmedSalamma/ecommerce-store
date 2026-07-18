import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getBrands } from '@/features/products/api/brand.service';

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands,
    queryFn: getBrands,
    staleTime: 5 * 60 * 1000,
  });
}
