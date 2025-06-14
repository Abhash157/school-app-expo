import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Defer router.replace until after mount
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.replace('/login');
    }
  }, [isReady]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
