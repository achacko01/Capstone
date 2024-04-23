import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (email !== verifiedEmail) {
        throw new Error("Emails don't match");
      }
      if (password !== verifiedPassword) {
        throw new Error("Passwords don't match");
      }

      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      if (user) {
        // Send email verification
        await user.sendEmailVerification();

        // Set additional user data in Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
          Gmail: email,
          isAdmin: false
        });

        // Navigate to the login screen
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email address is already in use!');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Verify Email"
        onChangeText={setVerifiedEmail}
        value={verifiedEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Verify Password"
        onChangeText={setVerifiedPassword}
        value={verifiedPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#00703C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  backButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default RegisterScreen;



