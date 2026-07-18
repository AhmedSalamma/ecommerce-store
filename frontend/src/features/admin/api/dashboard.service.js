import { api } from '@/api/axios';

export async function getDashboardStats() {
  const { data } = (await api.get('/admin/stats')).data;
  return data;
}
