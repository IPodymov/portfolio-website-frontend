import { api } from './axios';
import type { Order } from '../types';

export const ordersApi = {
  create: async (data: Omit<Order, 'id'>) => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },
};
