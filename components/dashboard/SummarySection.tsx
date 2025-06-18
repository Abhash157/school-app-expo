import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

type SummaryItemProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
};

function SummaryItem({ title, value, subtitle, icon, color = '#0d47a1' }: SummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.summaryValue, { color }]}>{value}</Text>
        <Text style={styles.summaryLabel}>{title}</Text>
        {subtitle && <Text style={styles.summarySubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

type SummarySectionProps = {
  attendance: {
    present: number;
    total: number;
  };
  nextClass: {
    subject: string;
    time: string;
  };
};

export function SummarySection({ attendance, nextClass }: SummarySectionProps) {
  const { colors } = useTheme();
  
  // Calculate attendance percentage and status
  const attendancePercentage = attendance.total > 0 
    ? Math.round((attendance.present / attendance.total) * 100) 
    : 0;
    
  const isAttendanceGood = attendancePercentage >= 75;
  const attendanceColor = isAttendanceGood ? '#4CAF50' : '#F44336';
  const attendanceStatus = isAttendanceGood ? 'Good' : 'Needs Improvement';

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Summary</Text>
      <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
        <View style={styles.divider} />
        
        <SummaryItem
          title="Attendance"
          value={`${attendancePercentage}%`}
          subtitle={`${attendance.present} of ${attendance.total} days`}
          color={attendanceColor}
          icon={
            <Text style={[styles.attendanceIcon, { color: attendanceColor }]}>
              {isAttendanceGood ? '✓' : '!'}
            </Text>
          }
        />
        
        <View style={styles.divider} />
        
        <SummaryItem
          title={nextClass.subject.includes('Break') ? 'Next Up' : 'Next Class'}
          value={nextClass.subject}
          subtitle={nextClass.time}
          color="#2196F3"
          icon={
            <Text style={[styles.classIcon, { color: '#2196F3' }]}>
              {nextClass.subject.includes('Break') ? '☕' : '📚'}
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  attendanceIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classIcon: {
    fontSize: 18,
  },
});
