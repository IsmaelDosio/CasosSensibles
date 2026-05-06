import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

interface AuthState {
  role: Role;
  user: string;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: 'admin',
      user: 'admin@scm',
      setRole: (role) =>
        set({
          role,
          user: role === 'admin' ? 'admin@scm' : 'editor@scm',
        }),
    }),
    { name: STORAGE_KEYS.auth },
  ),
);

export const useRole = () => useAuthStore((s) => s.role);
export const useCurrentUser = () => useAuthStore((s) => s.user);
