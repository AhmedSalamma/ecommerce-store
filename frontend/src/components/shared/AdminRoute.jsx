import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { getToken } from '@/api/tokenStorage';

export function AdminRoute() {
  const location = useLocation();
  const token = getToken();
  const { data: currentUser, isPending, isError } = useCurrentUser();

  if (token && isPending) {
    return <div className="min-h-screen" />;
  }

  if (!token || isError || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
