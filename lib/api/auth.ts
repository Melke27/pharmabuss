import { api, saveToken, clearToken } from './client';

export const authApi = {
  register: async (data: { name: string; email?: string; password?: string; phone?: string }) => {
    const res = await api.post('/auth/register', data);
    if (res.token) await saveToken(res.token);
    return res;
  },
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.token) await saveToken(res.token);
    return res;
  },
  getMe: async () => {
    return api.get('/auth/me');
  },
  updateProfile: async (data: any) => {
    return api.put('/auth/profile', data);
  },
  logout: async () => {
    await clearToken();
  },
};
