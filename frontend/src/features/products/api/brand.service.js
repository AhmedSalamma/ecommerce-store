import { api } from '@/api/axios';

export async function getBrands() {
  const { data } = (await api.get('/brands')).data;
  return data.map((brand) => ({
    id: brand.slug,
    name: brand.name,
    count: brand.products_count,
  }));
}
