import { api } from './axios';

export const contactApi = {
  sendMessage: async (data: { name: string; telegram: string; message: string }) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
};
