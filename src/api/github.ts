import axios from 'axios';
import type { GitHubUser, GitHubRepo } from '../types';

const GITHUB_API_URL = 'https://api.github.com';
const USERNAME = 'IPodymov';

export const githubApi = {
  getUser: async () => {
    const response = await axios.get<GitHubUser>(`${GITHUB_API_URL}/users/${USERNAME}`);
    return response.data;
  },
  getRepos: async () => {
    const response = await axios.get<GitHubRepo[]>(`${GITHUB_API_URL}/users/${USERNAME}/repos`);
    return response.data;
  },
};
