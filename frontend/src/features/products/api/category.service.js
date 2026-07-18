import { api } from '@/api/axios';

export async function getCategories() {
  const { data } = (await api.get('/categories')).data;
  return data.map((category) => ({
    id: category.slug,
    name: category.name,
    count: category.products_count,
  }));
}
