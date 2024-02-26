import { initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

// Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyCQxp3OV_OyjzdPgkp4uWmtSvZwcs61VcQ',
  authDomain: 'capstonegymapp.firebaseapp.com',
  projectId: 'capstonegymapp',
  storageBucket: 'capstonegymapp.appspot.com',
  messagingSenderId: '42204156247',
  appId: '1:42204156247:ios:00dceff74e8052c8afae12',
  databaseURL: 'https://capstonegymapp-default-rtdb.firebaseio.com'
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get Firebase Auth instance
export const firebaseAuth = getAuth(firebaseApp);

export default firebaseApp;
