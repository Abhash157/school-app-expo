// app/(app)/index.tsx
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../../stores/useAuth';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome {user?.name}!</Text>
      <Button 
        title="Go to Dashboard" 
        onPress={() => router.push('/dashboard')} 
      />
      <Button 
        title="Logout" 
        onPress={logout} 
      />
    </View>
  );
}