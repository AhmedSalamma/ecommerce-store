import { api } from '@/api/axios';
import { mapProduct } from '@/features/products/api/productMapper';

function buildProductFormData(payload) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('slug', payload.slug);
  formData.append('category_id', payload.categoryId);
  formData.append('description', payload.description);
  formData.append('price', payload.price);
  formData.append('stock', payload.stock);
  if (payload.image instanceof File) {
    formData.append('image', payload.image);
  }
  return formData;
}

export async function getAdminProducts(params = {}) {
  const { data, meta, links } = (await api.get('/admin/products', { params })).data;
  return { products: data.map(mapProduct), meta, links };
}

export async function createProduct(payload) {
  const { data } = (await api.post('/admin/products/store', buildProductFormData(payload))).data;
  return mapProduct(data);
}

export async function updateProduct(id, payload) {
  const { data } = (await api.post(`/admin/products/update/${id}`, buildProductFormData(payload))).data;
  return mapProduct(data);
}

export async function deleteProduct(id) {
  return (await api.post(`/admin/products/destroy/${id}`)).data;
}
