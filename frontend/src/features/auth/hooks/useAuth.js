import { useSelector } from 'react-redux';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function useAuth() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const logoutMutation = useLogout();

  return {
    user,
    isAuthenticated,
    logout: () => logoutMutation.mutate(),
  };
}
