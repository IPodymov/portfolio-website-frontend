import { api } from './axios';
import type { Notification } from '../types';

export const notificationsApi = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    const notifications = await notificationsApi.getMyNotifications();
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => notificationsApi.markAsRead(n.id)));
  },
};
