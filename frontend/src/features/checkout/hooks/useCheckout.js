import { useMutation } from '@tanstack/react-query';
import { checkout } from '@/features/checkout/api/checkout.service';

export function useCheckout() {
  return useMutation({
    mutationFn: checkout,
  });
}
