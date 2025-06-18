import { Feather } from '@expo/vector-icons';
import { Check, X } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { fetchMonthlyAttendance, generateTestData } from '../../services/attendanceService';
import { useAuth } from '../../stores/useAuth';

// Type definitions
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarDay {
  date: number;
  status: 'present' | 'absent' | 'saturday' | 'holiday' | 'none';
}

type CalendarWeek = CalendarDay[];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'present':
      return { 
        bg: '#4CAF50', // green
        text: 'white', 
        icon: <Check size={14} color="white" /> 
      };
    case 'absent':
      return { 
        bg: '#F44336', // red
        text: 'white', 
        icon: <X size={14} color="white" /> 
      };
    case 'saturday':
      return { 
        bg: '#E0E0E0', // light gray
        text: '#757575', // dark gray
        icon: null 
      };
    case 'holiday':
      return { 
        bg: '#FFF9C4', // light yellow
        text: '#F57F17', // dark yellow
        icon: null 
      };
    default:
      return { 
        bg: 'white', 
        text: '#BDBDBD', // light gray
        icon: null 
      };
  }
};

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarWeek[]>([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    saturdays: 0,
    holidays: 0,
    workingDays: 0
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(0);

  const loadAttendanceData = async (year: number, month: number) => {
    try {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }
      
      setLoading(true);
      const data = await fetchMonthlyAttendance(user._id, year, month);
      
      setCalendarData(data.calendarData || []);
      setStats(data.stats || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        saturdays: 0,
        holidays: 0,
        workingDays: 0
      });
      setCurrentMonth(data.month || new Date(year, month - 1).toLocaleString('default', { month: 'long' }));
      setCurrentYear(data.year || year);
    } catch (error) {
      console.error('Error loading attendance:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleGenerateTestData = async () => {
    try {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }
      
      setRefreshing(true);
      await generateTestData(user._id);
      await loadAttendanceData(currentDate.getFullYear(), currentDate.getMonth() + 1);
      Alert.alert('Success', 'Test data generated successfully');
    } catch (error) {
      console.error('Error generating test data:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate test data');
    } finally {
      setRefreshing(false);
    }
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    loadAttendanceData(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  useEffect(() => {
    const now = new Date();
    loadAttendanceData(now.getFullYear(), now.getMonth() + 1);
  }, [user?._id]);

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0d47a1" />
        <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadAttendanceData(currentDate.getFullYear(), currentDate.getMonth() + 1)}
        />
      }
    >
      {/* Title */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Attendance</Text>
        <Text style={{ fontSize: 14, color: 'gray' }}>
          {currentMonth} {currentYear}
        </Text>
      </View>

      {/* Month selector */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity 
          style={{ padding: 8 }}
          onPress={() => changeMonth(-1)}
          disabled={refreshing}
        >
          <Feather name="chevron-left" size={20} color={refreshing ? '#ccc' : 'black'} />
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 12, fontWeight: 'bold', fontSize: 16 }}>
          {currentMonth} {currentYear}
        </Text>
        <TouchableOpacity 
          style={{ padding: 8 }}
          onPress={() => changeMonth(1)}
          disabled={refreshing}
        >
          <Feather name="chevron-right" size={20} color={refreshing ? '#ccc' : 'black'} />
        </TouchableOpacity>
      </View>

      {/* Generate Test Data Button (for development) */}
      {__DEV__ && (
        <TouchableOpacity 
          onPress={handleGenerateTestData}
          disabled={refreshing}
          style={{
            backgroundColor: '#0d47a1',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 16,
            opacity: refreshing ? 0.5 : 1,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>
            {refreshing ? 'Generating...' : 'Generate Test Data'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Weekday headers */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        {weekdays.map((day, idx) => (
          <Text key={idx} style={{ flex: 1, textAlign: 'center', fontWeight: '500', fontSize: 12 }}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      {calendarData.length > 0 ? (
        <>
          {calendarData.map((week, weekIdx) => (
            <View key={weekIdx} style={{ flexDirection: 'row', marginBottom: 8 }}>
              {week.map((day, dayIdx) => {
                const { bg, text, icon } = getStatusStyle(day.status);
                return (
                  <View
                    key={dayIdx}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 100,
                      backgroundColor: day.date === 0 ? 'transparent' : bg,
                      opacity: day.date === 0 ? 0 : 1,
                    }}>
                    <Text style={{ fontSize: 12, color: text }}>
                      {day.date !== 0 ? day.date : ''}
                    </Text>
                    {icon}
                  </View>
                );
              })}
            </View>
          ))}
        </>
      ) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text>No attendance data available</Text>
        </View>
      )}

      {/* Stats */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: '600', fontSize: 14 }}>Total Days: {stats.totalDays} Days</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <View style={{ width: 16, height: 16, backgroundColor: 'green', marginRight: 6 }} />
          <Text style={{ fontSize: 14 }}>Total Present Days: {stats.presentDays} Days</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <View style={{ width: 16, height: 16, backgroundColor: 'red', marginRight: 6 }} />
          <Text style={{ fontSize: 14 }}>Total Absent Days: {stats.absentDays} Days</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <View style={{ width: 16, height: 16, backgroundColor: 'lightgray', marginRight: 6 }} />
          <Text style={{ fontSize: 14 }}>Saturdays: {stats.saturdays} Days</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <View style={{ width: 16, height: 16, backgroundColor: 'gold', marginRight: 6 }} />
          <Text style={{ fontSize: 14 }}>Holidays: {stats.holidays} Days</Text>
        </View>
      </View>
    </ScrollView>
  );
}
