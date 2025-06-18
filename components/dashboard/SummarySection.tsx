import { StyleSheet, Text, View } from 'react-native';

type SummaryItemProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function SummaryItem({ title, value, icon }: SummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryLabel}>{title}</Text>
      </View>
    </View>
  );
}

type SummarySectionProps = {
  attendance: {
    present: number;
    total: number;
  };
  nextClass?: {
    subject: string;
    time: string;
  };
};

export function SummarySection({ attendance, nextClass }: SummarySectionProps) {
  // Calculate attendance percentage
  const attendancePercentage = attendance.total > 0 
    ? Math.round((attendance.present / attendance.total) * 100) 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <SummaryItem
          title="Attendance"
          value={`${attendancePercentage}%`}
          icon={
            <Text style={[styles.attendanceIcon, { 
              color: attendancePercentage >= 75 ? '#4CAF50' : '#F44336' 
            }]}>📊</Text>
          }
        />
        
        {nextClass && (
          <SummaryItem
            title="Next Class"
            value={nextClass.subject}
            icon={
              <Text style={styles.classIcon}>⏰</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceIcon: {
    fontSize: 20,
  },
  classIcon: {
    fontSize: 20,
    color: '#2196F3',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
