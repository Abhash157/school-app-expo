// app/dashboard.tsx
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardMenu } from '../../components/dashboard/DashboardMenu';
import { ProfileSection } from '../../components/dashboard/ProfileSection';
import { SummarySection } from '../../components/dashboard/SummarySection';
import { useAuth } from '../../stores/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ProfileSection
        name={user?.name || 'Abhash Limbu'}
        grade="Bachelor"
        studentId="7777"
        dateOfBirth="2060/05/22"
        gender="Male"
        profileImageUrl={require('../../assets/abhash.jpeg')} // must use local asset or remote URL
      />

      <SummarySection 
        attendance={{ present: 45, total: 50 }}
        nextClass={{
          subject: 'Mathematics',
          time: '10:00 AM'
        }}
      />

      <DashboardMenu />

      <TouchableOpacity onPress={() => router.push('/dashboard')}>
        <Text style={styles.linkText}>Leave Application</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/college-logo.png')}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  linkText: {
    color: '#0d47a1',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  logoContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});
