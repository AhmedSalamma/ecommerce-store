import { api } from '@/api/axios';

export async function getAddresses() {
  const { data } = (await api.get('/addresses')).data;
  return data;
}

export async function createAddress(payload) {
  const { data } = (await api.post('/addresses', payload)).data;
  return data;
}

export async function deleteAddress(id) {
  return (await api.delete(`/addresses/${id}`)).data;
}
