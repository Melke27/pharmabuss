import { api } from './client';

export const habitsApi = {
  getAll: () => api.get('/habits'),
  create: (data: any) => api.post('/habits', data),
  update: (id: string, data: any) => api.put(`/habits/${id}`, data),
  delete: (id: string) => api.delete(`/habits/${id}`),
};
