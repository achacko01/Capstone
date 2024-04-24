import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Homepage from './Homepage';
import FacultyHomepage from './FacultyHomepage';
import AddMachineScreen from './AddMachineScreen';
import RemoveMachineScreen from './RemoveMachineScreen';
import AddMachineForm from './AddMachineForm';
import FeedbackPage from './FeedbackPage';
import ReservationPage from './ReservationPage';
import MachineUseHistoryScreen from './MachineUseHistoryScreen';
import { firebase } from './firebase';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!user ? 'Login' : 'Homepage'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Homepage" component={Homepage} options={{ title: 'Homepage' }} />
        <Stack.Screen name="ReservationPage" component={ReservationPage} options={{ title: 'Reserve' }} />
        <Stack.Screen name="FacultyHomepage" component={FacultyHomepage} options={{ title: 'Faculty Homepage' }} />
        <Stack.Screen name="AddMachine" component={AddMachineScreen} options={{ title: 'Machine List' }} />
        <Stack.Screen name="RemoveMachine" component={RemoveMachineScreen} options={{ title: 'Machine List' }} />
        <Stack.Screen name="AddMachineForm" component={AddMachineForm} options={{ title: 'Add Machine' }} />
        <Stack.Screen name="MachineUseHistory" component={MachineUseHistoryScreen} options={{ title: 'Machine Use History' }} />
        <Stack.Screen name="FeedbackPage" component={FeedbackPage} options={{ title: 'Feedback' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
