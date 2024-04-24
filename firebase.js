import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

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
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the Firebase instance and other services
export { firebase, app, analytics };
