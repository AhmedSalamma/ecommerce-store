import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '@/features/admin/api/category.service';

export function useAdminCategories() {
  return useQuery({
    queryKey: queryKeys.adminCategories,
    queryFn: getAdminCategories,
  });
}

function useInvalidateAdminCategories() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories });
    queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
  };
}

export function useCreateCategory() {
  const invalidate = useInvalidateAdminCategories();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateAdminCategories();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateAdminCategories();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
  });
}
