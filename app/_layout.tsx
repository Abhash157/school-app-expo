import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  // Add this debug log
  console.log('Auth state:', {
    isAuthenticated,
    isAuthLoading,
    hasToken: !!useAuthStore.getState().token
  });

  useEffect(() => {
    console.log('Running restoreSession...');
    const initialize = async () => {
      try {
        await restoreSession();
      } catch (error) {
        console.error('Failed to restore session:', error);
      }
    };
    initialize();
  }, [restoreSession]);  // Add restoreSession to dependency array

  console.log('Rendering with state:', { isAuthenticated, isAuthLoading });

  if (isAuthLoading) {
    console.log('Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading session...</Text>
      </View>
    );
  }

  console.log('Rendering main app with isAuthenticated:', isAuthenticated);
  // ... rest of your component
}