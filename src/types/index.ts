export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  token?: string;
}

export interface Review {
  id: number;
  username: string;
  body: string;
  projectLink: string;
  rating?: number;
  serviceQuality?: string;
  createdAt?: string;
}

export interface Order {
  id?: number;
  name: string;
  telegram: string;
  description: string;
  type: 'landing' | 'ecommerce' | 'webapp' | 'bot' | 'other';
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  language: string;
  stargazers_count: number;
  description: string | null;
  html_url: string;
}
