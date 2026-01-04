export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

export interface Review {
  id: number;
  username: string;
  body: string;
  projectLink: string;
  createdAt?: string;
}

export interface Order {
  id?: number;
  name: string;
  email: string;
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
}
