// components/dashboard/DashboardMenu.tsx
import { useRouter } from 'expo-router';
import { CalendarDays, ClipboardList, Clock, Users } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const menuItems = [
  { label: 'Attendance', icon: Clock, href: '/attendance' },
  { label: 'Assignment', icon: ClipboardList, href: '/assignments' },
  { label: 'Teacher', icon: Users, href: '/teachers' },
  { label: 'Calendar', icon: CalendarDays, href: '/calendar' },
];

export function DashboardMenu() {
  const router = useRouter();

  return (
    <View style={styles.menu}>
      {menuItems.map(({ label, icon: Icon, href }, index) => (
        <TouchableOpacity key={index} style={styles.item} onPress={() => router.push(href as any)}>
          <Icon size={24} color="#0d47a1" />
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  item: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
