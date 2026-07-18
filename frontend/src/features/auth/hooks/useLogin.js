import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/api/auth.service';
import { setUser } from '@/features/auth/authSlice';
import { setToken } from '@/api/tokenStorage';
import { queryKeys } from '@/api/queryKeys';

export function useLogin() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: ({ data, token }) => {
      setToken(token);
      dispatch(setUser(data));
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}
