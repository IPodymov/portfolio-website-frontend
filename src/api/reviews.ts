import { api } from './axios';
import type { Review } from '../types';

export const reviewsApi = {
  getAll: async () => {
    const response = await api.get<Review[]>('/reviews');
    return response.data;
  },
  getById: async (id: number) => {
    // Backend doesn't support GET /reviews/:id yet, so we fetch all and filter
    const response = await api.get<Review[]>('/reviews');
    const review = response.data.find((r) => r.id === id);
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  },
  create: async (data: Omit<Review, 'id' | 'createdAt'>) => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },
};
