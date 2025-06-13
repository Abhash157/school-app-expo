import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import api from '../utils/api';

export default function HomeScreen() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await api.get('/grades');
        setGrades(res.data);
      } catch (err) {
        console.error('Unauthorized or error:', err);
      }
    };
    fetchGrades();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {grades.map((grade: any, index) => (
        <Text key={index}>{grade.student} - {grade.subject}: {grade.score}</Text>
      ))}
    </View>
  );
}
