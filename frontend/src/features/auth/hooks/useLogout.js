import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/api/auth.service';
import { logout as logoutAction } from '@/features/auth/authSlice';
import { clearToken } from '@/api/tokenStorage';

export function useLogout() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearToken();
      dispatch(logoutAction());
      queryClient.clear();
    },
  });
}
