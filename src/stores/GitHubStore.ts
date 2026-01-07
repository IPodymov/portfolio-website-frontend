import { makeAutoObservable, runInAction } from 'mobx';
import type { GitHubUser, GitHubRepo } from '../types';
import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
const USERNAME = 'IPodymov';

// Target repos to display
const TARGET_REPO_NAMES = [
  'visuliser-backend',
  'pd-projects-backend',
  'visualizer-front',
  'pd-projects-frontend',
  'fakegram-frontend',
  'portfolio-website-frontend',
];

// Custom descriptions for repos
const CUSTOM_DESCRIPTIONS: Record<string, string> = {
  'visuliser-backend':
    'Веб-приложение для визуализации и сравнения образовательных программ. Реализовано на Django + DRF. Поддерживает парсинг Excel, анализ компетенций и сравнение планов.',
  'pd-projects-backend':
    'Бэкенд для системы управления проектами на NestJS и PostgreSQL. Реализована JWT авторизация, ролевая модель пользователей, управление учебными заведениями и фильтрация проектов.',
  'visualizer-front':
    'Клиентская часть системы визуализации образовательных программ. Разработана на Vue.js. Обеспечивает интерфейс для загрузки планов и просмотра аналитики.',
  'pd-projects-frontend':
    'Frontend для системы управления проектами. Написан на Vue.js. Реализует интерфейсы для студентов, преподавателей и администраторов.',
  'fakegram-frontend':
    'Instagram-клон на React + TypeScript + Redux Toolkit. Реализованы лента постов, истории, лайки, комментарии и профили пользователей.',
  'portfolio-website-frontend':
    'Этот сайт-портфолио. Разработан на React + Vite + TypeScript с использованием MobX и адаптивной верстки.',
};

class GitHubStore {
  user: GitHubUser | null = null;
  repos: GitHubRepo[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get displayRepos(): GitHubRepo[] {
    return this.repos.map(repo => ({
      ...repo,
      description: CUSTOM_DESCRIPTIONS[repo.name] || repo.description,
    }));
  }

  async loadData() {
    if (this.user && this.repos.length > 0) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    try {
      const [userResponse, reposResponse] = await Promise.all([
        axios.get<GitHubUser>(`${GITHUB_API_URL}/users/${USERNAME}`),
        axios.get<GitHubRepo[]>(`${GITHUB_API_URL}/users/${USERNAME}/repos`, {
          params: {
            sort: 'updated',
            per_page: 100,
          },
        }),
      ]);
      
      runInAction(() => {
        this.user = userResponse.data;
        this.repos = reposResponse.data.filter(repo => TARGET_REPO_NAMES.includes(repo.name));
      });
    } catch (err) {
      console.error('Error fetching GitHub data:', err);
      runInAction(() => {
        this.error = 'Не удалось загрузить данные GitHub';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clearError() {
    this.error = null;
  }
}

export const githubStore = new GitHubStore();
