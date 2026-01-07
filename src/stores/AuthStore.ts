import { makeAutoObservable, runInAction } from 'mobx';
import type { User, LoginResponse, RegisterResponse, ProfileResponse } from '../types';
import { UserRole } from '../types';
import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
}

class AuthStore {
  user: User | null = null;
  permissions: string[] = [];
  isLoading = true;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.checkAuth();
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  get isAdmin(): boolean {
    return this.user?.role === UserRole.ADMIN;
  }

  get isModerator(): boolean {
    return this.user?.role === UserRole.MODERATOR || this.user?.role === UserRole.ADMIN;
  }

  async checkAuth() {
    try {
      const response = await api.get<ProfileResponse>('/auth/profile');
      runInAction(() => {
        this.user = response.data.user;
        this.permissions = response.data.permissions || [];
      });
    } catch {
      runInAction(() => {
        this.user = null;
        this.permissions = [];
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loginUser(data: LoginData): Promise<boolean> {
    this.error = null;
    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      runInAction(() => {
        this.user = response.data.user;
        this.permissions = response.data.permissions || [];
      });
      return true;
    } catch {
      runInAction(() => {
        this.error = 'Ошибка входа. Проверьте данные.';
      });
      return false;
    }
  }

  async registerUser(data: RegisterData): Promise<boolean> {
    this.error = null;
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      runInAction(() => {
        this.user = response.data.user;
        this.permissions = response.data.permissions || [];
      });
      return true;
    } catch {
      runInAction(() => {
        this.error = 'Ошибка регистрации. Возможно email уже занят.';
      });
      return false;
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      runInAction(() => {
        this.user = null;
        this.permissions = [];
      });
    }
  }

  async refreshUser() {
    try {
      const response = await api.get<ProfileResponse>('/auth/profile');
      runInAction(() => {
        this.user = response.data.user;
        this.permissions = response.data.permissions || [];
      });
    } catch {
      runInAction(() => {
        this.user = null;
        this.permissions = [];
      });
    }
  }

  async updateProfile(data: { firstName: string; lastName: string; telegram: string }): Promise<boolean> {
    try {
      await api.put<ProfileResponse>('/auth/profile', data);
      await this.refreshUser();
      return true;
    } catch {
      return false;
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  clearError() {
    this.error = null;
  }
}

export const authStore = new AuthStore();
