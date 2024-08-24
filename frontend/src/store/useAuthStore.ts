import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/api'; // Assuming you have an api instance set up

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        setTimeout(() => get().refreshAccessToken(), 24 * 60 * 60 * 1000);
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      refreshAccessToken: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await api.post('/users/refreshToken', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          set({ accessToken, refreshToken: newRefreshToken });

          // Schedule next token refresh
          setTimeout(() => get().refreshAccessToken(), 24 * 60 * 60 * 1000);
        } catch (error) {
          console.error('Failed to refresh access token:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;