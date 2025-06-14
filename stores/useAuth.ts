import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type User = {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  restoreSession: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      restoreSession: async () => {
        set({ isLoading: true });
        try {
          const { token, user } = get();
      
          // Optional: add real API token validation here
          if (token && user) {
            set({ isAuthenticated: true });
          } else {
            set({ isAuthenticated: false });
          }
        } catch (error) {
          console.error('Error restoring session:', error);
          set({ isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
      

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Replace with your actual login API call
          const mockUser = { id: '1', email, name: 'Test User' };
          const mockToken = 'mock-jwt-token';
          set({ 
            user: mockUser, 
            token: mockToken, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Login failed. Please try again.',
            isLoading: false 
          });
          throw error;
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Replace with your actual API call
          // const response = await api.post('/auth/register', userData);
          // const { user, token } = response.data;
          
          // Mock response for now
          const mockUser = {
            id: '1',
            email: userData.email,
            name: userData.name,
          };
          const mockToken = 'mock-jwt-token';
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // unique name for the storage key
      storage: createJSONStorage(() => AsyncStorage), // use AsyncStorage for React Native
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    }
  )
);

// Export a hook that can be used to access the auth store
export const useAuthStore = () => useAuth((state) => state);
