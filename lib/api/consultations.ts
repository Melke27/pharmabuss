import { api } from './client';

export const consultationsApi = {
  getAll: () => api.get('/consultations'),
  create: (data: any) => api.post('/consultations', data),
  sendMessage: (id: string, message: any) => api.post(`/consultations/${id}/messages`, message),
  update: (id: string, data: any) => api.put(`/consultations/${id}`, data),
  getPharmacists: () => api.get('/consultations/pharmacists'),
};
