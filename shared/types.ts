export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
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