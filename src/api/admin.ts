import { api } from './axios';
import type { User, Project, AdminStats, ProjectStatus } from '../types';

export interface CreateUserByAdminData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
  role?: string;
}

export interface CreateProjectByAdminData {
  name: string;
  telegram: string;
  description: string;
  type: string;
  userId?: number;
}

export interface UpdateProjectLinksData {
  githubRepoLink?: string;
  specLink?: string;
}

export const adminApi = {
  // Dashboard stats
  getStats: async (): Promise<AdminStats> => {
    const [users, projects, reviews] = await Promise.all([
      adminApi.getUsers(),
      adminApi.getProjects(),
      api.get('/reviews').then(res => res.data),
    ]);
    
    const pendingProjects = projects.filter(p => p.status === 'pending').length;
    const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    return {
      totalUsers: users.length,
      totalProjects: projects.length,
      totalReviews: reviews.length,
      pendingProjects,
      completedProjects,
      inProgressProjects,
    };
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },
  
  createUser: async (data: CreateUserByAdminData): Promise<User> => {
    const response = await api.post<User>('/admin/users', data);
    return response.data;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/admin/projects');
    return response.data;
  },
  
  createProject: async (data: CreateProjectByAdminData): Promise<Project> => {
    const response = await api.post<Project>('/admin/projects', data);
    return response.data;
  },
  
  updateProjectStatus: async (id: number, status: ProjectStatus): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}/status`, { status });
    return response.data;
  },
  
  updateProjectLinks: async (id: number, links: UpdateProjectLinksData): Promise<Project> => {
    const response = await api.put<Project>(`/admin/projects/${id}/links`, links);
    return response.data;
  },
  
  syncCommits: async (id: number): Promise<void> => {
    await api.post(`/admin/projects/${id}/sync-commits`);
  },
  
  addProjectHistory: async (id: number, description: string): Promise<void> => {
    await api.post(`/projects/${id}/history`, { description });
  },

  // Reviews
  deleteReview: async (id: number): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};

