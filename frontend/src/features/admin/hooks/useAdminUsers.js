import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { createUser, deleteUser, getAdminUsers, updateUser } from '@/features/admin/api/user.service';

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: queryKeys.adminUsers(params),
    queryFn: () => getAdminUsers(params),
    placeholderData: (previous) => previous,
  });
}

function useInvalidateAdminUsers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.adminStats });
  };
}

export function useCreateUser() {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: createUser,
    onSuccess: invalidate,
  });
}

export function useUpdateUser() {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: invalidate,
  });
}
