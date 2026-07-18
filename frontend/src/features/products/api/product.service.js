import { api } from '@/api/axios';
import { mapProduct } from './productMapper';

export async function getProducts(params = {}) {
  const { data, meta, links } = (await api.get('/products', { params })).data;
  return { products: data.map(mapProduct), meta, links };
}

export async function getProduct(id) {
  const { data } = (await api.get(`/products/${id}`)).data;
  return mapProduct(data);
}
