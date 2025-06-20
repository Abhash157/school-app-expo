import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../types/routes';

interface MenuItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
}

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      title: 'Manage Users',
      icon: 'people',
      route: 'app/admin/users',
    },
    {
      title: 'Attendance Management',
      icon: 'calendar',
      route: 'app/admin/attendance',
    },
    {
      title: 'Grades Management',
      icon: 'book',
      route: 'app/admin/grades',
    },
    {
      title: 'Routine Management',
      icon: 'calendar-outline',
      route: 'app/admin/routine',
    },
    {
      title: 'Leave Management',
      icon: 'time-outline',
      route: 'app/admin/leave',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <Ionicons name={item.icon} size={24} color="#6c5ce7" />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push('/dashboard')}
      >
        <Ionicons name="exit-outline" size={24} color="#ff4757" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3542',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2f3542',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#ff4757',
  },
});
