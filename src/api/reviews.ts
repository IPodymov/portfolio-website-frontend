import { api } from './axios';
import type { Review } from '../types';

export const reviewsApi = {
  getAll: async () => {
    const response = await api.get<Review[]>('/reviews');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  },
  create: async (data: Omit<Review, 'id' | 'createdAt'>) => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },
};
