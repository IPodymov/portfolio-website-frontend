import { makeAutoObservable, runInAction } from 'mobx';
import api from './api';

interface ContactFormData {
  name: string;
  telegram: string;
  message: string;
}

class ContactStore {
  isSubmitting = false;
  isSuccess = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

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
}

export const contactStore = new ContactStore();
