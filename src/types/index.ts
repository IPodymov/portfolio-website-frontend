// Constants as const objects for TypeScript erasableSyntaxOnly compatibility
export const UserRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ProjectStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ProjectType = {
  LANDING: 'landing',
  ECOMMERCE: 'ecommerce',
  WEBAPP: 'webapp',
  BOT: 'bot',
  OTHER: 'other'
} as const;

export type ProjectType = typeof ProjectType[keyof typeof ProjectType];

export const ServiceQuality = {
  EXCELLENT: 'Отлично',
  GOOD: 'Хорошо',
  NORMAL: 'Нормально',
  BAD: 'Плохо',
  TERRIBLE: 'Ужасно'
} as const;

export type ServiceQuality = typeof ServiceQuality[keyof typeof ServiceQuality];

export const ContactRequestStatus = {
  PENDING: 'pending',
  CONTACTED: 'contacted',
  CLOSED: 'closed'
} as const;

export type ContactRequestStatus = typeof ContactRequestStatus[keyof typeof ContactRequestStatus];

// API Request types
export interface CreateProjectRequest {
  name: string;
  telegram: string;
  description: string;
  type: ProjectType;
}

export interface ContactFormRequest {
  name: string;
  telegram: string;
  message: string;
}

export interface CreateReviewRequest {
  body: string;
  projectLink?: string;
  rating: number;
  serviceQuality: ServiceQuality;
}

// Admin API types
export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalReviews: number;
  pendingProjects: number;
  completedProjects: number;
  inProgressProjects: number;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
  role?: UserRole;
  password?: string; // Will be hashed on backend
}

// Interfaces
export interface User {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  telegram?: string;
  avatarUrl?: string;
  role: UserRole;
  name?: string; // вычисляемое поле с бэкенда
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectHistory {
  id: number;
  description: string;
  createdAt: string;
}

export interface Project {
  id: number;
  title?: string;
  clientName: string;
  telegram: string;
  type: ProjectType;
  description: string;
  status: ProjectStatus;
  githubRepoLink?: string;
  specLink?: string;
  user?: User;
  history?: ProjectHistory[];
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: number;
  body: string;
  projectLink?: string;
  rating: number;
  serviceQuality: ServiceQuality | string;
  user: User;
  username: string; // добавляется бэкендом
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactRequest {
  id: number;
  name: string;
  telegram: string;
  message: string;
  status: ContactRequestStatus;
  user?: User;
  userId?: number;
  handledBy?: User;
  handledById?: number;
  handledAt?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface ContactRequestStats {
  total: number;
  pending: number;
  contacted: number;
  closed: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  sender?: User;
  receiver?: User;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  user: User;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export interface SendMessageRequest {
  receiverId: number;
  content: string;
}

// Auth
export interface AuthResponse {
  user: User;
  permissions: string[];
  token?: string;
}

export interface LoginResponse extends AuthResponse {
  token: string;
}

export interface RegisterResponse extends AuthResponse {
  token: string;
}

export type ProfileResponse = AuthResponse;

// GitHub
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
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at?: string;
  homepage?: string;
}
