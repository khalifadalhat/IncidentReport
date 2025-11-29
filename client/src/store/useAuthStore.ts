/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '@/utils/api';

interface User {
  id: string;
  fullname?: string;
  email: string;
  role: 'customer' | 'agent' | 'admin' | 'supervisor';
  department?: string;
  phone?: string;
  location?: string;
  gender?: string;
  profileImage?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get('token') || null,
      isLoading: false,
      error: null,

      setUser: (user: User | null) => set({ user }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/api/auth/login', { email, password });
          const { token, user } = res.data;

          Cookies.set('token', token, { expires: 7 });
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.error || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/api/auth/register', data);
          const { token, user } = res.data;

          Cookies.set('token', token, { expires: 7 });
          set({ user, token, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.error || 'Registration failed',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);