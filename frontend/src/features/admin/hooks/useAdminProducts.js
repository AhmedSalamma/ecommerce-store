import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from '@/features/admin/api/product.service';

export function useAdminProducts(params = {}) {
  return useQuery({
    queryKey: queryKeys.adminProducts(params),
    queryFn: () => getAdminProducts(params),
    placeholderData: (previous) => previous,
  });
}

function useInvalidateAdminProducts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
  };
}

export function useCreateProduct() {
  const invalidate = useInvalidateAdminProducts();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateAdminProducts();
  return useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateAdminProducts();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidate,
  });
}
