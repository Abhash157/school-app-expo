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

async function validateCredentials(email: string, password: string): Promise<boolean> {
  // Replace this with your actual validation logic
  try {
      const response = await fetch('http://192.168.1.65:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  
  
  // try {
  //   const response = await fetch('your-api-endpoint/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });
  //   return response.ok;
  // } catch (error) {
  //   return false;
  // }
}


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
          // Simple validation - replace with your actual API call
          if (!email || !password) {
            throw new Error('Email and password are required');
          }
      
          // Add your actual validation logic here
          // For example, check against a list of valid users or call your API
          const isValidCredentials = await validateCredentials(email, password);
          
          if (!isValidCredentials) {
            throw new Error('Invalid email or password');
          }
      
          // Only set authenticated state if credentials are valid
          const mockUser = { 
            id: '1', 
            email, 
            name: email.split('@')[0] // Simple way to create a username from email
          };
          const mockToken = 'valid-jwt-token';
          
          set({ 
            user: mockUser, 
            token: mockToken, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed. Please try again.',
            isLoading: false 
          });
          throw error; // Re-throw to allow handling in the UI
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
