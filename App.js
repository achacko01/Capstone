import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import Homepage from './Homepage'; // Import your Homepage component
import FacultyHomepage from './FacultyHomepage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Homepage" component={Homepage} options={{ title: 'Homepage' }} />
        <Stack.Screen name="FacultyHomepage" component={FacultyHomepage} options={{ title: 'Faculty Homepage '}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
