import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance, { IAttendance } from '../models/Attendance';

interface CalendarDay {
  date: number;
  status: 'present' | 'absent' | 'saturday' | 'holiday' | 'none';
  subject?: string;
}

type CalendarWeek = CalendarDay[];

export const getMonthlyAttendance = async (req: Request, res: Response) => {
  try {
    const { userId, year, month } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Generate calendar data
    const calendarData = [];
    const daysInMonth = endDate.getDate();
    let week = [];
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = startDate.getDay();
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      week.push({ date: 0, status: 'none' });
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Number(year), Number(month) - 1, day);
      const attendanceRecord = attendance.find((record: IAttendance) => 
        record.date.getDate() === day
      );
      
      // If it's Saturday, mark as 'saturday', otherwise use the attendance status or default to 'absent'
      let status = 'absent';
      if (currentDate.getDay() === 6) { // Saturday
        status = 'saturday';
      } else if (attendanceRecord) {
        status = attendanceRecord.status;
      }
      
      week.push({ date: day, status });
      
      // If week is full (7 days) or it's the last day of the month
      if (week.length === 7 || day === daysInMonth) {
        // If it's the last day and the week isn't full, fill the rest with empty slots
        while (week.length < 7) {
          week.push({ date: 0, status: 'none' });
        }
        calendarData.push(week);
        week = [];
      }
    }

    // Calculate statistics
    const presentDays = attendance.filter((a: IAttendance) => a.status === 'present').length;
    const absentDays = attendance.filter((a: IAttendance) => a.status === 'absent').length;
    const saturdays = Math.ceil(daysInMonth / 7); // Approximate
    const holidays = attendance.filter((a: IAttendance) => a.status === 'holiday').length;

    res.json({
      calendarData,
      stats: {
        totalDays: daysInMonth,
        presentDays,
        absentDays,
        saturdays,
        holidays,
        workingDays: daysInMonth - saturdays - holidays
      },
      month: startDate.toLocaleString('default', { month: 'long' }),
      year: startDate.getFullYear()
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to generate test data
export const generateTestData = async (userId: string) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const testData: Partial<IAttendance>[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends (Saturdays and Sundays)
      if (dayOfWeek === 6) { // Saturday
        testData.push({
          userId: new mongoose.Types.ObjectId(userId),
          date,
          status: 'saturday'
        });
        continue;
      } else if (dayOfWeek === 0) { // Sunday
        testData.push({
          userId: new mongoose.Types.ObjectId(userId),
          date,
          status: 'holiday'
        });
        continue;
      }
      
      // For weekdays, randomly mark as present (80%) or absent (20%)
      const isPresent = Math.random() < 0.8;
      const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Nepali'];
      
      testData.push({
        userId: new mongoose.Types.ObjectId(userId),
        date,
        status: isPresent ? 'present' : 'absent',
        subject: isPresent ? subjects[Math.floor(Math.random() * subjects.length)] : undefined
      });
    }
    
    // Clear existing test data for this user
    await Attendance.deleteMany({ userId });
    
    // Insert new test data
    await Attendance.insertMany(testData);
    
    return { success: true, count: testData.length };
  } catch (error) {
    console.error('Error generating test data:', error);
    throw error;
  }
};
