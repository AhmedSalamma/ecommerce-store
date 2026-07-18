import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/features/auth/api/auth.service';
import { getToken } from '@/api/tokenStorage';
import { queryKeys } from '@/api/queryKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getCurrentUser,
    enabled: Boolean(getToken()),
    retry: false,
  });
}
