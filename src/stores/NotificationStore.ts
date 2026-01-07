import { makeAutoObservable, runInAction } from 'mobx';
import api from './api';
import type { Notification } from '../types';

class NotificationStore {
  notifications: Notification[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get unreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  get readNotifications(): Notification[] {
    return this.notifications.filter(n => n.isRead);
  }

  async loadNotifications(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await api.get<Notification[]>('/notifications');
      runInAction(() => {
        this.notifications = response.data;
        this.isLoading = false;
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка загрузки уведомлений';
        this.isLoading = false;
      });
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      runInAction(() => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка при отметке уведомления';
      });
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      // Помечаем все непрочитанные уведомления как прочитанные
      const unreadIds = this.notifications.filter(n => !n.isRead).map(n => n.id);
      await Promise.all(unreadIds.map(id => api.patch(`/notifications/${id}/read`)));
      runInAction(() => {
        this.notifications.forEach(n => {
          n.isRead = true;
        });
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      runInAction(() => {
        this.error = error.response?.data?.message || 'Ошибка при отметке уведомлений';
      });
    }
  }

  reset(): void {
    this.notifications = [];
    this.isLoading = false;
    this.error = null;
  }
}

export const notificationStore = new NotificationStore();
