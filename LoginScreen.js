import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios'; // Import Axios library

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:4000/login', { email, password })
      .then(response => {
        // Handle successful login
        console.log('Login successful');
        // Navigate to the home screen or perform any other action
      })
      .catch(error => {
        // Handle login error
        console.error('Login failed:', error);
        // Display error message to the user
      });
  };

  const handleSignUp = () => {
    axios.post('http://localhost:4000/signup', { email, password, role: 'member' })
      .then(response => {
        // Handle successful sign up
        console.log('Sign up successful');
        // Navigate to the home screen or perform any other action
      })
      .catch(error => {
        // Handle sign up error
        console.error('Sign up failed:', error);
        // Display error message to the user
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 5,
    borderTopColor: '#00703C',
    borderBottomWidth: 5,
    borderBottomColor: '#00703C',
  },
  formContainer: {
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#00703C',
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

export default LoginScreen;
