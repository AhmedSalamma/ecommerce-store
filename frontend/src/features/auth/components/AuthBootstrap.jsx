import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { setUser } from '@/features/auth/authSlice';

export function AuthBootstrap() {
  const dispatch = useDispatch();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) dispatch(setUser(user));
  }, [user, dispatch]);

  return null;
}
