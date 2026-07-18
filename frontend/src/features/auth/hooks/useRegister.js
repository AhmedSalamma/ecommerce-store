import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { register } from '@/features/auth/api/auth.service';
import { setUser } from '@/features/auth/authSlice';
import { setToken } from '@/api/tokenStorage';
import { queryKeys } from '@/api/queryKeys';

export function useRegister() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: ({ data, token }) => {
      setToken(token);
      dispatch(setUser(data));
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}
