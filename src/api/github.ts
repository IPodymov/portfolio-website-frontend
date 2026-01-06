import { api } from './axios';
import axios from 'axios';
import type { GitHubUser, GitHubRepo } from '../types';

const GITHUB_API_URL = 'https://api.github.com';
const USERNAME = 'IPodymov';

export const githubApi = {
  // Direct GitHub API calls
  getUser: async (): Promise<GitHubUser> => {
    const response = await axios.get<GitHubUser>(`${GITHUB_API_URL}/users/${USERNAME}`);
    return response.data;
  },
  
  getRepos: async (): Promise<GitHubRepo[]> => {
    const response = await axios.get<GitHubRepo[]>(`${GITHUB_API_URL}/users/${USERNAME}/repos`, {
      params: {
        sort: 'updated',
        per_page: 100,
      },
    });
    return response.data;
  },

  // Backend API calls (if needed)
  getReposFromBackend: async (): Promise<GitHubRepo[]> => {
    const response = await api.get<GitHubRepo[]>('/github/repos');
    return response.data;
  },
};

