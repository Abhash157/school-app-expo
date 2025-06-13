import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const API_URL = process.env.API_URL || 'http://192.168.1.65:4000/api/auth/login'; // Use environment variable for API URL

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,

  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(API_URL, { email: username, password });

      const token = response.data.token;
      // Persist token securely (e.g., AsyncStorage for React Native)
      await AsyncStorage.setItem('authToken', token);
      set({ isAuthenticated: true, token });
    } catch (error) {
      console.error('Login failed', error);
      // Update state to reflect login failure
      set({ isAuthenticated: false, token: null });
    }
  },

  logout: async () => {
    // Clear token from secure storage
    await AsyncStorage.removeItem('authToken');
    set({ isAuthenticated: false, token: null });
  },
}));
