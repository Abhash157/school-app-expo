import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setAuthToken } from '../utils/auth';


export type User = {
  _id: string;
  id: string; // For backward compatibility
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
          // Input validation
          if (!email || !password) {
            throw new Error('Email and password are required');
          }
      
          // Make the login API call
          const response = await fetch('http://192.168.1.65:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          const responseData = await response.json();
          console.log('Login response:', responseData);
          
          if (!response.ok) {
            // Handle API error response
            throw new Error(
              responseData.message || 
              responseData.error || 
              `Login failed with status ${response.status}`
            );
          }
          
          // Backend only returns a token, so we'll create a minimal user object
          const authToken = responseData.token;
          if (!authToken) {
            throw new Error('No token received from server');
          }
          
          // Create a basic user object with the email and a generated ID
          // Note: In a real app, you might want to fetch the user profile after login
          const userId = email.split('@')[0]; // Simple ID generation from email
          const user = {
            _id: userId,
            id: userId,
            email: email,
            name: email.split('@')[0], // Use the part before @ as name
          };
          
          // Save token to AsyncStorage
          await setAuthToken(authToken);
          
          set({ 
            user, 
            token: authToken, 
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
          const response = await fetch('http://192.168.1.65:4000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          const responseData = await response.json();
          const user = {
            _id: responseData.user._id,
            id: responseData.user._id, // For backward compatibility
            email: responseData.user.email,
            name: responseData.user.name,
          };
          const mockToken = 'mock-jwt-token';
          
          set({
            user: user,
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
