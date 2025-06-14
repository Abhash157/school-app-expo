// app/layout.tsx
import { Slot } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';
export default function Layout() {
  return (
    // <Stack>
    //   <Stack.Screen name="Login" options={{ headerShown: false }} />
    //   <Stack.Screen name="Dashboard" options={{ title: 'Dashboard' }} />
    //   <Stack.Screen name="Grades" options={{ title: 'Grades' }} />
    // </Stack>
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
    // <Stack
    //   screenOptions={{
    //     headerShown: false,
    //   }}
    // />
  );
}
