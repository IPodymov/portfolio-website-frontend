import { api } from './axios';
import type { Project, CreateProjectRequest, ProjectStatus } from '../types';

export const projectsApi = {
  // User endpoints
  getMyProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },
  
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },
  
  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },
  
  // Admin/Moderator endpoints
  updateStatus: async (id: number, status: ProjectStatus): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}/status`, { status });
    return response.data;
  },
  
  addHistory: async (id: number, description: string): Promise<void> => {
    await api.post(`/projects/${id}/history`, { description });
  },
};

