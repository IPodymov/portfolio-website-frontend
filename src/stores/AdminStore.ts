import { makeAutoObservable, runInAction } from 'mobx';
import type { User, Project, Review, AdminStats, ProjectStatus, UpdateUserRequest } from '../types';
import api from './api';

class AdminStore {
  users: User[] = [];
  projects: Project[] = [];
  reviews: Review[] = [];
  stats: AdminStats | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get pendingProjects() {
    return this.projects.filter(p => p.status === 'pending');
  }

  get inProgressProjects() {
    return this.projects.filter(p => p.status === 'in_progress');
  }

  get completedProjects() {
    return this.projects.filter(p => p.status === 'completed');
  }

  async loadDashboard() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const [usersResponse, projectsResponse, reviewsResponse] = await Promise.all([
        api.get<User[]>('/admin/users'),
        api.get<Project[]>('/admin/projects'),
        api.get<Review[]>('/reviews'),
      ]);
      
      runInAction(() => {
        this.users = usersResponse.data;
        this.projects = projectsResponse.data;
        this.reviews = reviewsResponse.data;
        
        this.stats = {
          totalUsers: this.users.length,
          totalProjects: this.projects.length,
          totalReviews: this.reviews.length,
          pendingProjects: this.projects.filter(p => p.status === 'pending').length,
          inProgressProjects: this.projects.filter(p => p.status === 'in_progress').length,
          completedProjects: this.projects.filter(p => p.status === 'completed').length,
        };
      });
    } catch (err) {
      console.error('Failed to load dashboard', err);
      runInAction(() => {
        this.error = 'Не удалось загрузить данные';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadUsers() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.get<User[]>('/admin/users');
      runInAction(() => {
        this.users = response.data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить пользователей';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadProjects() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.get<Project[]>('/admin/projects');
      runInAction(() => {
        this.projects = response.data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить проекты';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateProjectStatus(projectId: number, newStatus: ProjectStatus): Promise<boolean> {
    this.error = null;
    
    try {
      await api.patch(`/projects/${projectId}/status`, { status: newStatus });
      runInAction(() => {
        this.projects = this.projects.map(p => 
          p.id === projectId ? { ...p, status: newStatus } : p
        );
        if (this.stats) {
          this.stats = {
            ...this.stats,
            pendingProjects: this.projects.filter(p => p.status === 'pending').length,
            inProgressProjects: this.projects.filter(p => p.status === 'in_progress').length,
            completedProjects: this.projects.filter(p => p.status === 'completed').length,
          };
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to update status', err);
      runInAction(() => {
        this.error = 'Не удалось обновить статус';
      });
      return false;
    }
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.patch<User>(`/admin/users/${userId}`, data);
      runInAction(() => {
        this.users = this.users.map(u => 
          u.id === userId ? { ...u, ...response.data } : u
        );
      });
      return true;
    } catch (err) {
      console.error('Failed to update user', err);
      runInAction(() => {
        this.error = 'Не удалось обновить пользователя';
      });
      return false;
    }
  }

  async deleteReview(reviewId: number): Promise<boolean> {
    this.error = null;
    
    try {
      await api.delete(`/reviews/${reviewId}`);
      runInAction(() => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        if (this.stats) {
          this.stats = {
            ...this.stats,
            totalReviews: this.reviews.length,
          };
        }
      });
      return true;
    } catch (err) {
      console.error('Failed to delete review', err);
      runInAction(() => {
        this.error = 'Не удалось удалить отзыв';
      });
      return false;
    }
  }

  async updateProjectLinks(projectId: number, githubRepoLink: string, specLink: string): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.put<Project>(`/admin/projects/${projectId}/links`, { 
        githubRepoLink: githubRepoLink || null, 
        specLink: specLink || null 
      });
      runInAction(() => {
        this.projects = this.projects.map(p => 
          p.id === projectId ? { ...p, ...response.data } : p
        );
      });
      return true;
    } catch (err) {
      console.error('Failed to update project links', err);
      runInAction(() => {
        this.error = 'Не удалось обновить ссылки проекта';
      });
      return false;
    }
  }

  async addProjectHistory(projectId: number, description: string): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.post<Project>(`/projects/${projectId}/history`, { description });
      runInAction(() => {
        this.projects = this.projects.map(p => 
          p.id === projectId ? response.data : p
        );
      });
      return true;
    } catch (err) {
      console.error('Failed to add project history', err);
      runInAction(() => {
        this.error = 'Не удалось добавить запись в историю';
      });
      return false;
    }
  }

  clearError() {
    this.error = null;
  }

  reset() {
    this.users = [];
    this.projects = [];
    this.reviews = [];
    this.stats = null;
    this.error = null;
  }
}

export const adminStore = new AdminStore();
