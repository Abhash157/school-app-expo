import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { useAuthStore } from '../store/auth';

export default function LoginScreen({ navigation }: any) {
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(username, password); // this sets isAuthenticated
  
    const success = useAuthStore.getState().isAuthenticated; // get latest state
  
    if (success) {
      navigation.navigate('Home');
    } else {
      console.log('Login failed');
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 10 }} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
