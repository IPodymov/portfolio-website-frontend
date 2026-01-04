import { api } from './axios';
import type { User } from '../types';

export const authApi = {
  login: async (data: any) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  updateProfile: async (data: Partial<User> & { password?: string }) => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};
