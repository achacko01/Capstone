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
import ReservationPage from './ReservationPage';
import FeedbackPage from './FeedbackPage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh5aSvmD-P9zbdyEruAZjr3Xk9Il_ySPk",
  authDomain: "capstone-authentication-57df3.firebaseapp.com",
  databaseURL: "https://capstone-authentication-57df3-default-rtdb.firebaseio.com",
  projectId: "capstone-authentication-57df3",
  storageBucket: "capstone-authentication-57df3.appspot.com",
  messagingSenderId: "1324354770",
  appId: "1:1324354770:web:8470a1f59c10cd0b49b10b",
  measurementId: "G-9PLK93NBCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); // State to store current user
  const [firebaseInitialized, setFirebaseInitialized] = useState(false); // Flag to indicate Firebase initialization

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    // Unsubscribe to the listener when component unmounts
    return unsubscribe;
  }, []);

  // Initialize Firebase Analytics if supported
  useEffect(() => {
    if (firebase.analytics.isSupported()) {
      firebase.analytics();
    }
  }, []);

  useEffect(() => {
    // Check if Firebase is initialized
    if (firebase.apps.length > 0) {
      setFirebaseInitialized(true);
    }
  }, []);

  if (!firebaseInitialized) {
    return null; // Render nothing until Firebase is initialized
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!user ? 'Login' : 'Homepage'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Homepage" component={Homepage} options={{ title: 'Homepage' }} />
        <Stack.Screen name="FacultyHomepage" component={FacultyHomepage} options={{ title: 'Faculty Homepage' }} />
        <Stack.Screen name="AddMachine" component={AddMachineScreen} options={{ title: 'Machine List' }} />
        <Stack.Screen name="RemoveMachine" component={RemoveMachineScreen} options={{ title: 'Machine List' }} />
        <Stack.Screen name="AddMachineForm" component={AddMachineForm} options={{ title: 'Add Machine' }} />
        <Stack.Screen name="ReservationPage" component={ReservationPage} options={{ title: 'Reserve a Machine' }} />
        <Stack.Screen name="FeedbackPage" component={FeedbackPage} options={{ title: 'Feedback' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
