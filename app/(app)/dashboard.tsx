import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardMenu } from '../../components/dashboard/DashboardMenu';
import { ProfileSection } from '../../components/dashboard/ProfileSection';
import { SummarySection } from '../../components/dashboard/SummarySection';
import { fetchMonthlyAttendance } from '../../services/attendanceService';
import { useAuth } from '../../stores/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({ present: 0, total: 0 });
  const [nextClass, setNextClass] = useState({ subject: 'No more classes today', time: '' });

  useEffect(() => {
    const loadDashboardData = async () => {
      console.log('Loading dashboard data...');
      if (!user?._id) {
        console.log('No user ID available');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        
        console.log(`Fetching attendance for user ${user._id}, ${year}-${month}`);
        
        try {
          const data = await fetchMonthlyAttendance(user._id, year, month);
          console.log('Attendance data received:', data);
          
          if (data?.stats) {
            setAttendance({
              present: data.stats.presentDays || 0,
              total: data.stats.workingDays || 0
            });
          } else {
            console.warn('No stats in attendance data');
            setAttendance({ present: 0, total: 0 });
          }
        } catch (attendanceError) {
          console.error('Error fetching attendance:', attendanceError);
          // Continue with default values if attendance fetch fails
          setAttendance({ present: 0, total: 0 });
        }
        
        // Set next class based on current time (temporary solution)
        const currentHour = now.getHours();
        let nextClass = { subject: 'No more classes today', time: '' };
        
        if (currentHour < 10) {
          nextClass = { subject: 'Mathematics', time: '10:00 AM' };
        } else if (currentHour < 12) {
          nextClass = { subject: 'Science', time: '12:00 PM' };
        } else if (currentHour < 14) {
          nextClass = { subject: 'Lunch Break', time: '2:00 PM' };
        } else if (currentHour < 16) {
          nextClass = { subject: 'English', time: '4:00 PM' };
        }
        
        console.log('Setting next class:', nextClass);
        setNextClass(nextClass);
        
      } catch (error) {
        console.error('Unexpected error in loadDashboardData:', error);
      } finally {
        console.log('Finished loading dashboard data');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?._id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0d47a1" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileSection
        name={user?.name || 'Guest User'}
        grade="Grade 10"
        studentId={user?._id?.substring(0, 6) || 'N/A'}
        dateOfBirth=""
        gender=""
        profileImageUrl={require('../../assets/college-logo.png')}
      />

      <SummarySection 
        attendance={attendance}
        nextClass={nextClass}
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
