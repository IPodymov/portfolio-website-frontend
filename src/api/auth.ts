import { api } from './axios';
import type { User, LoginResponse } from '../types';

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    // Store token in localStorage for Authorization header
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
};

