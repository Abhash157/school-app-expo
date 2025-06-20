import { Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { fetchMonthlyAttendance } from '../../services/attendanceService';
import { useAuth } from '../../stores/useAuth';

type ViewType = 'week' | 'month';

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
        text: '#FF2222', // red 
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

const styles = {
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 2,
    marginBottom: 16,
    alignSelf: 'center',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dateRangeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  weekViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 8,
  },
  dayHeader: {
    fontWeight: '500',
    marginBottom: 8,
  },
  dayContent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarWeek[]>([]);
  const [viewType, setViewType] = useState<ViewType>('month');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(0);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    saturdays: 0,
    holidays: 0,
    workingDays: 0
  });

  // Calculate date range based on view type
  const { startDate, endDate } = useMemo(() => {
    const date = new Date(currentDate);
    if (viewType === 'week') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to start on Monday
      const start = new Date(date);
      start.setDate(diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { startDate: start, endDate: end };
    } else {
      // Month view
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return { startDate: start, endDate: end };
    }
  }, [currentDate, viewType]);

  // Format date range for display
  const dateRangeText = useMemo(() => {
    if (viewType === 'week') {
      return `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} - ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getFullYear()}`;
    }
    return `${currentMonth} ${currentYear}`;
  }, [viewType, startDate, endDate, currentMonth, currentYear]);

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

  const changeDateRange = (increment: number) => {
    const newDate = new Date(currentDate);
    if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (increment * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + increment);
    }
    setCurrentDate(newDate);
    loadAttendanceData(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const toggleViewType = () => {
    setViewType(prev => prev === 'month' ? 'week' : 'month');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAttendanceData(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate]);

  useEffect(() => {
    loadAttendanceData(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, []);

  // Render week view
  const renderWeekView = () => {
    const startDay = new Date(startDate);
    
    return (
      <View style={styles.weekViewContainer}>
        {Array(7).fill(0).map((_, index) => {
          const day = new Date(startDay);
          day.setDate(startDay.getDate() + index);
          const dayData = calendarData.flat().find(d => d.date === day.getDate() && d.date !== 0);
          const { bg, text, icon } = getStatusStyle(dayData?.status || 'none');
          
          return (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayHeader}>{weekdays[day.getDay()].substring(0, 1)}</Text>
              <View style={[styles.dayContent, { backgroundColor: bg }]}>
                <Text style={{ color: text, fontSize: 14, fontWeight: '500' }}>
                  {day.getDate()}
                </Text>
                {icon}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Render month view
  const renderMonthView = () => {
    // Ensure each week has exactly 7 days by filling with empty days if needed
    const normalizedWeeks = calendarData.map(week => {
      const weekCopy = [...week];
      while (weekCopy.length < 7) {
        weekCopy.push({ date: 0, status: 'none' });
      }
      return weekCopy;
    });

    return (
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          {weekdays.map((day, idx) => (
            <Text key={idx} style={{ flex: 1, textAlign: 'center', fontWeight: '500', fontSize: 12 }}>{day}</Text>
          ))}
        </View>
        {normalizedWeeks.length > 0 ? (
          normalizedWeeks.map((week, weekIdx) => (
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
          ))
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text>No attendance data available</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.calendarContainer}>
        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewType === 'week' && styles.toggleButtonActive
            ]}
            onPress={() => setViewType('week')}>
            <Text style={[
              styles.toggleButtonText,
              viewType === 'week' && styles.toggleButtonTextActive
            ]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewType === 'month' && styles.toggleButtonActive
            ]}
            onPress={() => setViewType('month')}>
            <Text style={[
              styles.toggleButtonText,
              viewType === 'month' && styles.toggleButtonTextActive
            ]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Selector */}
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity onPress={() => changeDateRange(-1)} disabled={refreshing}>
            <ChevronLeft size={24} color={refreshing ? '#ccc' : '#000'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateRangeText}>
              {dateRangeText}
            </Text>
            <CalendarIcon size={16} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => changeDateRange(1)} disabled={refreshing}>
            <ChevronRight size={24} color={refreshing ? '#ccc' : '#000'} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10 }}>Loading attendance data...</Text>
          </View>
        ) : viewType === 'week' ? (
          renderWeekView()
        ) : (
          renderMonthView()
        )}
      </View>

      {/* Stats */}
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 12 }}>Summary</Text>
        <View style={{ marginTop: 4 }}>
          <Text style={{ fontWeight: '600', fontSize: 14 }}>Total Days: {stats.totalDays} Days</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <View style={{ width: 16, height: 16, backgroundColor: '#4CAF50', marginRight: 6, borderRadius: 8 }} />
            <Text style={{ fontSize: 14 }}>Present: {stats.presentDays} Days</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <View style={{ width: 16, height: 16, backgroundColor: '#F44336', marginRight: 6, borderRadius: 8 }} />
            <Text style={{ fontSize: 14 }}>Absent: {stats.absentDays} Days</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <View style={{ width: 16, height: 16, backgroundColor: '#E0E0E0', marginRight: 6, borderRadius: 8 }} />
            <Text style={{ fontSize: 14 }}>Saturdays: {stats.saturdays} Days</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <View style={{ width: 16, height: 16, backgroundColor: '#FFF9C4', marginRight: 6, borderRadius: 8 }} />
            <Text style={{ fontSize: 14 }}>Holidays: {stats.holidays} Days</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
