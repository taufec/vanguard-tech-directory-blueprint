import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/types';
interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
// Mock user for demo purposes
const MOCK_ADMIN: User = {
  id: 'u1',
  name: 'Admin Demo',
  email: 'admin@vanguard.tech',
  role: 'admin',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_ADMIN, // Default to logged in as admin for demo
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'vanguard-auth-storage',
    }
  )
);
export const checkProjectAccess = (user: User | null, ownerId: string) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.id === ownerId;
};