import { api } from '@/api/axios';

export async function checkout({ addressId, notes }) {
  const { data } = (await api.post('/checkout', { address_id: addressId, notes })).data;
  return data;
}

export async function getCheckoutSuccess(orderId, sessionId) {
  return (await api.get(`/checkout/success/${orderId}`, { params: { session_id: sessionId } })).data;
}

export async function getCheckoutCancel() {
  return (await api.get('/checkout/cancel')).data;
}
