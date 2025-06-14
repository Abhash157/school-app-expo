// // providers/AuthProvider.tsx
import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../stores/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, restoreSession } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await restoreSession();
      setIsNavigationReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isNavigationReady || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, segments, router, isNavigationReady]);

  if (isLoading || !isNavigationReady) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

// Protected route component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return isAuthenticated ? <>{children}</> : null;
}
