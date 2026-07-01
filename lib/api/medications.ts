import { api } from './client';

export const medicationsApi = {
  getAll: () => api.get('/medications'),
  getById: (id: string) => api.get(`/medications/${id}`),
  create: (data: any) => api.post('/medications', data),
  update: (id: string, data: any) => api.put(`/medications/${id}`, data),
  delete: (id: string) => api.delete(`/medications/${id}`),
};
