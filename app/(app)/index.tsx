// app/(app)/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../../stores/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading spinner
  }

  return isAuthenticated ? <Redirect href="/(app)/dashboard" /> : <Redirect href="/login" />;
}
