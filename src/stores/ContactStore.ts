import { makeAutoObservable, runInAction } from 'mobx';
import type { ContactRequest, ContactRequestStats, ContactRequestStatus } from '../types';
import api from './api';

interface ContactFormData {
  name: string;
  telegram: string;
  message: string;
}

class ContactStore {
  // Форма отправки
  isSubmitting = false;
  isSuccess = false;
  error: string | null = null;
  
  // Админка - заявки
  requests: ContactRequest[] = [];
  stats: ContactRequestStats | null = null;
  isLoadingRequests = false;
  requestsError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // === Публичные методы для формы контактов ===
  
  async sendMessage(data: ContactFormData): Promise<boolean> {
    this.isSubmitting = true;
    this.error = null;
    this.isSuccess = false;
    
    try {
      await api.post('/contact', data);
      runInAction(() => {
        this.isSuccess = true;
      });
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      runInAction(() => {
        this.error = error.response?.data?.message || error.message || 'Ошибка отправки';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }

  reset() {
    this.isSubmitting = false;
    this.isSuccess = false;
    this.error = null;
  }

  clearError() {
    this.error = null;
  }

  // === Админские методы для работы с заявками ===
  
  async loadRequests(status?: ContactRequestStatus) {
    this.isLoadingRequests = true;
    this.requestsError = null;
    
    try {
      const url = status ? `/contact/requests?status=${status}` : '/contact/requests';
      const response = await api.get<ContactRequest[]>(url);
      runInAction(() => {
        this.requests = response.data;
      });
    } catch (err) {
      console.error('Failed to load contact requests', err);
      runInAction(() => {
        this.requestsError = 'Не удалось загрузить заявки';
      });
    } finally {
      runInAction(() => {
        this.isLoadingRequests = false;
      });
    }
  }

  async loadStats() {
    try {
      const response = await api.get<ContactRequestStats>('/contact/requests/stats');
      runInAction(() => {
        this.stats = response.data;
      });
    } catch (err) {
      console.error('Failed to load contact stats', err);
    }
  }

  async updateRequestStatus(
    requestId: number, 
    status: ContactRequestStatus, 
    notes?: string
  ): Promise<boolean> {
    try {
      const response = await api.patch<ContactRequest>(`/contact/requests/${requestId}/status`, {
        status,
        notes
      });
      
      runInAction(() => {
        const index = this.requests.findIndex(r => r.id === requestId);
        if (index >= 0) {
          this.requests[index] = response.data;
        }
        // Обновляем статистику
        this.loadStats();
      });
      
      return true;
    } catch (err) {
      console.error('Failed to update request status', err);
      return false;
    }
  }

  // Получить количество pending заявок для badge
  get pendingCount(): number {
    return this.stats?.pending || 0;
  }
}

export const contactStore = new ContactStore();
