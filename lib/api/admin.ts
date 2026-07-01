import { api } from './client';

export const adminApi = {
  getUsers: (page = 1, limit = 20, search = '') =>
    api.get(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  setRole: (id: string, role: 'user' | 'admin') => api.put(`/admin/users/${id}/role`, { role }),
  getStats: () => api.get('/admin/stats'),
};
