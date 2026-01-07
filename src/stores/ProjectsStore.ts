import { makeAutoObservable, runInAction } from 'mobx';
import type { Project, CreateProjectRequest, ProjectStatus } from '../types';
import api from './api';

class ProjectsStore {
  myProjects: Project[] = [];
  currentProject: Project | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadMyProjects() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await api.get<Project[]>('/projects');
      runInAction(() => {
        this.myProjects = response.data;
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

  async loadProjectById(id: number) {
    this.isLoading = true;
    this.error = null;
    this.currentProject = null;
    
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      runInAction(() => {
        this.currentProject = response.data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить проект';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createProject(data: CreateProjectRequest): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.post<Project>('/projects', data);
      runInAction(() => {
        this.myProjects = [...this.myProjects, response.data];
      });
      return true;
    } catch {
      runInAction(() => {
        this.error = 'Не удалось создать проект';
      });
      return false;
    }
  }

  async updateProjectStatus(id: number, status: ProjectStatus): Promise<boolean> {
    this.error = null;
    
    try {
      const response = await api.patch<Project>(`/projects/${id}/status`, { status });
      runInAction(() => {
        this.myProjects = this.myProjects.map(p => 
          p.id === id ? response.data : p
        );
        if (this.currentProject?.id === id) {
          this.currentProject = response.data;
        }
      });
      return true;
    } catch {
      runInAction(() => {
        this.error = 'Не удалось обновить статус';
      });
      return false;
    }
  }

  clearError() {
    this.error = null;
  }

  clearCurrentProject() {
    this.currentProject = null;
  }
}

export const projectsStore = new ProjectsStore();
