import { api } from './client';

export const dietApi = {
  getAll: (params?: { date?: string; startDate?: string; endDate?: string; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.type) query.set('type', params.type);
    return api.get(`/diet${query.toString() ? '?' + query.toString() : ''}`);
  },
  create: (data: any) => api.post('/diet', data),
  update: (id: string, data: any) => api.put(`/diet/${id}`, data),
  delete: (id: string) => api.delete(`/diet/${id}`),
};
