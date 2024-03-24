import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';

const Homepage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gym App</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReservationPage')}>
        <Text style={styles.buttonText}>Reserve</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Community Chat')}>
        <Text style={styles.buttonText}>Community Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Feedback')}>
        <Text style={styles.buttonText}>Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Leaderboards')}>
        <Text style={styles.buttonText}>Leaderboards</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9DADE',
    borderTopWidth: 5,
    borderTopColor: '#00703C',
    borderBottomWidth: 5,
    borderBottomColor: '#00703C',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000', // Adjust color as needed
  },
  button: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#00703C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Homepage;
