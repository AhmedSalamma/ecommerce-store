import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getDashboardStats } from '@/features/admin/api/dashboard.service';

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  });
}
