export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'user' | 'admin';
export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
}
export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  url: string;
  logoUrl?: string;
  screenshotUrl?: string;
  tags: string[];
  ownerId: string;
  createdAt: number;
  votes: number;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}