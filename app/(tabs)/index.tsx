import MainHomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Home" component={MainHomeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  
});
