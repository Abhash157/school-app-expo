import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function GradesScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grades</Text>
      <Text style={styles.grade}>Math: A</Text>
      <Text style={styles.grade}>Science: B+</Text>
      <Text style={styles.grade}>History: A-</Text>
      <View style={styles.button}>
        <Button 
          title="Back to Dashboard" 
          onPress={() => router.back()} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  grade: {
    fontSize: 18,
    marginVertical: 8,
  },
  button: {
    marginTop: 30,
    width: '80%',
    alignSelf: 'center',
  },
});