import { LinkProps as OriginalLinkProps } from 'expo-router/build/link/Link';
import { Router } from 'expo-router';

declare module 'expo-router' {
  export type RootStackParamList = {
    '/(tabs)': undefined;
    '/login': undefined;
    '/register': undefined;
    '/home': undefined;
    '/dashboard': undefined;
    '/grades': undefined;
    '/profile': undefined;
    // Add other routes as needed
  };

  export function useRouter(): Omit<Router, 'push' | 'replace' | 'navigate'> & {
    push<T extends keyof RootStackParamList>(
      route: T | { pathname: T; params?: RootStackParamList[T] }
    ): void;
    replace<T extends keyof RootStackParamList>(
      route: T | { pathname: T; params?: RootStackParamList[T] }
    ): void;
    navigate<T extends keyof RootStackParamList>(
      route: T | { pathname: T; params?: RootStackParamList[T] }
    ): void;
  };

  export interface LinkProps<T extends keyof RootStackParamList>
    extends Omit<OriginalLinkProps, 'href'> {
    href: T | { pathname: T; params?: RootStackParamList[T] };
  }
}
