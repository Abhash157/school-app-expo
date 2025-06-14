import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../stores/useAuth';

// Helper function for type-safe navigation
const navigate = (router: any, route: string) => {
  try {
    if (route.startsWith('/(tabs)')) {
      router.replace(route as any);
    } else {
      router.replace(route as any);
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router]);

  // Show error alert when error state changes
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      clearError();
      console.log('Attempting login with:', email);
      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const handleSignUp = () => {
    clearError();
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Svg
        width="110%"
        height="800"
        viewBox="10 0 480 200"
        preserveAspectRatio="none"
        style={styles.svg}
      >
        <Path
          d="M0,0 M0,40 C150,90 350,30 500,90 L500,0 L0,0 Z"
          fill="#d1d5db"
        />
      </Svg>
      <View style={styles.header}>
        <Image source={require('@/assets/college-logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerText}>
          <Text style={styles.title}>SHAHID SMARAK COLLEGE</Text>
          <Text style={styles.subtitle}>Kirtipur, Kathmandu</Text>
      </View>
      </View>

      
      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>Demo Accounts:</Text>
          <Text style={styles.demoText}>Email: student@example.com</Text>
          <Text style={styles.demoText}>Password: student123</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 All Rights Reserved</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Terms & Conditions</Text>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </View>
      </View>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative', backgroundColor: '#fff', paddingHorizontal: 20, justifyContent: 'space-between' },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: [{ scaleX: -1 }],
  },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 60, justifyContent: 'center'},
  headerText: { flex: 9, alignItems: 'center', justifyContent: 'center',   },
  logo: { flex: 1, width: 50, height: 50, marginRight: 10 },
  title: { fontWeight: 'bold', fontSize: 22, color: '#0a2f5c' },
  subtitle: { fontSize: 14, color: 'gray' },
  form: { marginTop: 40 },
  input: {
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    paddingVertical: 10,
    marginBottom: 20,
    paddingRight: 40,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: '#0a2f5c',
    padding: 14,
    borderRadius: 10,
    width: '37%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10 },
  demoInfo: { marginTop: 20 },
  demoText: { fontSize: 12, color: 'gray' },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: { fontSize: 12, color: 'white', backgroundColor: '#0a2f5c', width: '100%', textAlign: 'center', padding: 6 },
  footerLinks: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  footerLink: { fontSize: 10, color: '#0a2f5c', marginHorizontal: 10 },
});
