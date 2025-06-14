// store/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthLoading: true,

      login: async (email, password) => {
        try {
          const res = await axios.post('http://192.168.1.65:4000/api/auth/login', {
            email,
            password,
          });
          const token = res.data.token;
          const user = res.data.user || { id: 1, email }; // Replace if backend returns full user

          set({
            token,
            user,
            isAuthenticated: true,
            isAuthLoading: false,
          });

          return true;
        } catch (err) {
          console.error('Login failed:', err);
          set({ isAuthLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      restoreSession: async () => {
        console.log('1. Starting restoreSession');
        try {
          const { token } = get();
          console.log('2. Current token:', token);
          
          if (token) {
            console.log('3. Token exists, setting authenticated');
            set({ 
              isAuthenticated: true,
              isAuthLoading: false 
            });
          } else {
            console.log('3. No token, setting not authenticated');
            set({ 
              isAuthenticated: false,
              isAuthLoading: false 
            });
          }
        } catch (error) {
          console.error('4. Error in restoreSession:', error);
          set({ 
            isAuthenticated: false,
            isAuthLoading: false 
          });
        }
        console.log('5. Finished restoreSession');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
