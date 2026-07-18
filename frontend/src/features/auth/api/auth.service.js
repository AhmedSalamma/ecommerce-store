import { api } from '@/api/axios';

export async function login(credentials) {
  return (await api.post('/login', credentials)).data;
}

export async function register(payload) {
  return (await api.post('/register', payload)).data;
}

export async function logout() {
  return (await api.post('/logout')).data;
}

export async function getCurrentUser() {
  const { data } = (await api.get('/me')).data;
  return data;
}
