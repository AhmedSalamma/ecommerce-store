import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getAddresses } from '@/features/checkout/api/address.service';

export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: getAddresses,
  });
}
