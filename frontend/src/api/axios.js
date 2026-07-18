import axios from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { getToken, clearToken } from '@/api/tokenStorage';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت';
    } else if (error.response.status === 401) {
      clearToken();
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);
