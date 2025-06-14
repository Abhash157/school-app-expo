// app/dashboard.tsx
import { useAuth } from '@/stores/useAuth';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={{ padding: 20 }}>
      {isAuthenticated ? (
        <Text>Welcome back, {user?.name}!</Text>
      ) : (
        <Text>Please log in</Text>
      )}
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Dashboard</Text>
      <Button title="Go to Grades" onPress={() => router.push('/grades')} />
    </View>
  );
}
