import { useAuthStore } from '@/store/auth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.email}</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Go to Grades" 
          onPress={() => router.push('/grades')} 
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Go to Home" 
          onPress={() => router.push('/home')} 
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Logout" 
          onPress={logout} 
          color="#FF3B30"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  buttonSpacer: {
    height: 15,
  },
});