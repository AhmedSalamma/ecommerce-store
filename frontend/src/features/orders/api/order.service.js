import { api } from '@/api/axios';

export async function getOrders(params = {}) {
  const { data, meta } = (await api.get('/orders', { params })).data;
  return { orders: data, meta };
}

export async function getOrder(id) {
  const { data } = (await api.get(`/orders/${id}`)).data;
  return data;
}

export async function cancelOrder(id) {
  return (await api.post(`/orders/${id}/cancel`)).data;
}
