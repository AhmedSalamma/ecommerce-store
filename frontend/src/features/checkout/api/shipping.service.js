import { api } from '@/api/axios';

export async function getShippingPrices() {
  const { data } = (await api.get('/shipping-prices')).data;
  return data;
}
