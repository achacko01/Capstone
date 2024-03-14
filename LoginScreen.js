import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


const LoginScreen = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');


const handleLogin = () => {
  // If login is successful, navigate to the Homepage
  navigation.navigate('Home');
};


const handleSignUp = () => {
  // // Here is where we will eimplement the sign up logic
  console.log('Signing up...');
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
