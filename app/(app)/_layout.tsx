// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { Button } from 'react-native';
import { useAuth } from '../../stores/useAuth';

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          title: 'Home',
          headerRight: () => (
            <Button onPress={logout} title="Logout" />
          )
        }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          headerRight: () => (
            <Button onPress={logout} title="Logout" />
          )
        }} 
      />
    </Stack>
  );
}