// app/dashboard.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Dashboard</Text>
      <Button title="Go to Grades" onPress={() => router.push('/grades')} />
    </View>
  );
}
