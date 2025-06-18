import { getAuthToken } from '../utils/auth';
import { BASE_URL } from './api';

export interface AttendanceData {
  calendarData: Array<Array<{
    date: number;
    status: 'present' | 'absent' | 'saturday' | 'holiday' | 'none';
  }>>;
  stats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    saturdays: number;
    holidays: number;
    workingDays: number;
  };
  month: string;
  year: number;
}

// Generate mock calendar data for a month
const generateMockCalendarData = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarData: Array<Array<{date: number; status: 'present' | 'absent' | 'saturday' | 'holiday' | 'none'}>> = [];
  let week: Array<{date: number; status: 'present' | 'absent' | 'saturday' | 'holiday' | 'none'}> = [];
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  // Add empty slots for days before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    week.push({ date: 0, status: 'none' });
  }
  
  // Fill in the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    
    // Determine status (simplified logic for demo)
    let status: 'present' | 'absent' | 'saturday' | 'holiday' | 'none' = 'present'; // default
    if (dayOfWeek === 6) status = 'saturday';
    if (day % 7 === 0) status = 'holiday'; // Every 7th day is a holiday for demo
    if (day % 10 === 0) status = 'absent'; // Every 10th day is absent for demo
    
    week.push({ date: day, status });
    
    // Start a new week after Saturday
    if (dayOfWeek === 6 || day === daysInMonth) {
      calendarData.push(week);
      week = [];
    }
  }
  
  return calendarData;
};

export const fetchMonthlyAttendance = async (userId: string, year: number, month: number): Promise<AttendanceData> => {
  // For development, return mock data
  if (__DEV__) {
    console.log('Using mock attendance data for development');
    const calendarData = generateMockCalendarData(year, month);
    
    // Calculate stats from mock data
    const stats = {
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      saturdays: 0,
      holidays: 0,
      workingDays: 0
    };
    
    calendarData.forEach((week: Array<{date: number; status: string}>) => {
      week.forEach((day: {date: number; status: string}) => {
        if (day.status === 'present') stats.presentDays++;
        if (day.status === 'absent') stats.absentDays++;
        if (day.status === 'saturday') stats.saturdays++;
        if (day.status === 'holiday') stats.holidays++;
        if (day.status !== 'none') stats.totalDays++;
      });
    });
    
    stats.workingDays = stats.totalDays - stats.saturdays - stats.holidays;
    
    return {
      calendarData,
      stats,
      month: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
      year
    };
  }
  
  // Production code - make actual API call
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${BASE_URL}/api/attendance/${userId}/monthly/${year}/${month}`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch attendance data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

export const generateTestData = async (userId: string) => {
  const token = await getAuthToken();
  const response = await fetch(
    `${BASE_URL}/api/attendance/test-data/${userId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate test data');
  }

  return response.json();
};
