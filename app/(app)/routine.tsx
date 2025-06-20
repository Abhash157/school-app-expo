// app/routine.tsx (or your preferred path)
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dayColors = ['#FFB74D70', '#4DB6AC70', '#7E57C270', '#8D6E6370', '#66BB6A70', '#FF704370'];

type RoutineRow = {
  time: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
};

const routineData: RoutineRow[] = [
  { time: '08:00', sunday: 'Math', monday: 'Physics', tuesday: 'Chemistry', wednesday: 'Biology', thursday: 'English', friday: 'History' },
  { time: '09:00', sunday: 'Physics', monday: 'Chemistry', tuesday: 'Biology', wednesday: 'English', thursday: 'History', friday: 'Math' },
  { time: '10:00', sunday: 'Chemistry', monday: 'Biology', tuesday: 'English', wednesday: 'History', thursday: 'Math', friday: 'Physics' },
  { time: '11:00', sunday: 'Biology', monday: 'English', tuesday: 'History', wednesday: 'Math', thursday: 'Physics', friday: 'Chemistry' },
  { time: '12:00', sunday: 'English', monday: 'History', tuesday: 'Math', wednesday: 'Physics', thursday: 'Chemistry', friday: 'Biology' },
];

export default function RoutineScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Class Routine</Text>
        <Text style={styles.subtitle}>Check your class routine here...</Text>
      </View>

      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContent}>
            <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeader, { width: 0 }]}>Time</Text>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                    <Text key={index} style={styles.tableHeader}>{day}</Text>
                ))}
            </View>

            {routineData.map((row, index) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={styles.timeCell}>{row.time}</Text>
                    <Text style={[styles.tableCell, { backgroundColor: dayColors[0] }]}>{row.sunday}</Text>
                    <Text style={[styles.tableCell, { backgroundColor: dayColors[1] }]}>{row.monday}</Text>
                    <Text style={[styles.tableCell, { backgroundColor: dayColors[2] }]}>{row.tuesday}</Text>
                    <Text style={[styles.tableCell, { backgroundColor: dayColors[3] }]}>{row.wednesday}</Text>
                    <Text style={[styles.tableCell, { backgroundColor: dayColors[4] }]}>{row.thursday}</Text>
                    <Text style={[styles.tableCell, { backgroundColor: dayColors[5] }]}>{row.friday}</Text>
                </View>
            ))}
            </View>
          </ScrollView>
    </View>

      <View style={styles.logoContainer}>
        <Image source={require('../../assets/college-logo.png')} style={styles.logo} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 16,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tableContent: {
    padding: 16,
    flexDirection: 'column',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  timeCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    margin: 8,
    width: 75,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    width: 100,
  },
  logoContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  link: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  },
  
  
);