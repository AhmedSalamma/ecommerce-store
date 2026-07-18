import { api } from '@/api/axios';

export async function getAdminUsers(params = {}) {
  const { data, meta, links } = (await api.get('/admin/users', { params })).data;
  return { users: data, meta, links };
}

export async function createUser(payload) {
  const { data } = (
    await api.post('/admin/users', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    })
  ).data;
  return data;
}

export async function updateUser(id, payload) {
  const body = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
  if (payload.password) {
    body.password = payload.password;
  }
  const { data } = (await api.put(`/admin/users/${id}`, body)).data;
  return data;
}

export async function deleteUser(id) {
  return (await api.delete(`/admin/users/${id}`)).data;
}
