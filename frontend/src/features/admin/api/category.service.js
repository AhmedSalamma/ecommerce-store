import { api } from '@/api/axios';

function mapCategory(raw) {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    isActive: raw.is_active,
    image: raw.image,
    productsCount: raw.products_count,
  };
}

function buildCategoryFormData(payload) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('slug', payload.slug);
  formData.append('description', payload.description ?? '');
  formData.append('is_active', payload.isActive ? '1' : '0');
  if (payload.image instanceof File) {
    formData.append('image', payload.image);
  }
  return formData;
}

export async function getAdminCategories() {
  const { data } = (await api.get('/admin/categories')).data;
  return data.map(mapCategory);
}

export async function createCategory(payload) {
  const { data } = (await api.post('/admin/categories/store', buildCategoryFormData(payload))).data;
  return mapCategory(data);
}

export async function updateCategory(id, payload) {
  const { data } = (await api.post(`/admin/categories/update/${id}`, buildCategoryFormData(payload))).data;
  return mapCategory(data);
}

export async function deleteCategory(id) {
  return (await api.post(`/admin/categories/destroy/${id}`)).data;
}
