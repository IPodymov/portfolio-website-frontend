import { api } from './axios';
import type { Review, CreateReviewRequest } from '../types';

export const reviewsApi = {
  getAll: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews');
    return response.data;
  },

  getById: async (id: number): Promise<Review> => {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  },

  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};

// Re-export for backwards compatibility
export type { CreateReviewRequest as CreateReviewData } from '../types';

