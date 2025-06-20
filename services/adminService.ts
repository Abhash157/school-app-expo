import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';
import axios from 'axios';

const ADMIN_TOKEN_KEY = 'admin_token';
const API_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

interface AdminCredentials {
  username: string;
  password: string;
}

interface AdminResponse {
  token: string;
  user: User & { isAdmin: boolean };
}

export const adminService = {
  async login(credentials: AdminCredentials): Promise<AdminResponse> {
    const response = await axios.post(`${API_URL}/admin/login`, credentials);
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
    return response.data;
  },

  async verifyToken(): Promise<boolean> {
    const token = await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;

    try {
      const response = await axios.get(`${API_URL}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.isValid;
    } catch (error) {
      return false;
    }
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(ADMIN_TOKEN_KEY);
  },

  async logout(): Promise<void> {
    const token = await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      await axios.post(`${API_URL}/admin/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    await AsyncStorage.removeItem(ADMIN_TOKEN_KEY);
  }
};
