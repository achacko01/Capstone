import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import firebase from 'firebase/compat/app'; // Make sure to import firebase
import 'firebase/compat/firestore'; // Import Firestore

const FeedbackPage = ({ navigation }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async () => {
    if (feedbackText.trim() === '') {
      Alert.alert('Feedback is empty', 'Please enter your feedback before submitting.');
      return;
    }
    if (userName.trim() === '') {
      Alert.alert('Name is empty', 'Please enter your name before submitting.');
      return;
    }
    if (userEmail.trim() === '') {
      Alert.alert('Email is empty', 'Please enter your email before submitting.');
      return;
    }
  
    try {
      const feedbackRef = firebase.firestore().collection('feedback');
      await feedbackRef.add({
        text: feedbackText, // Changed key to 'text' for clarity
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Add timestamp
        userName: userName, // Send the user's name
        userEmail: userEmail, // Send the user's email
      });
      Alert.alert("Feedback Submitted");
      setFeedbackText(''); // Clear the feedback text
      setUserName('');
      setUserEmail('');
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error(error);
      Alert.alert("Feedback Submission Failed", "Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <View style={styles.userDetailsContainer}>
        <TextInput
          style={styles.nameEmailInput}
          placeholder="Your Name"
          onChangeText={setUserName}
          value={userName}
        />
        <TextInput
          style={styles.nameEmailInput}
          placeholder="Your Email"
          onChangeText={setUserEmail}
          value={userEmail}
        />
      </View>
      <TextInput
        style={styles.feedbackInput}
        placeholder="Type your feedback here..."
        onChangeText={setFeedbackText}
        value={feedbackText}
        multiline
        numberOfLines={10}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9DADE',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
  },
  userDetailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  nameEmailInput: {
    width: '100%',
    borderColor: '#00703C',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    minHeight: 40, // Smaller height for single line inputs
  },
  feedbackInput: {
    width: '100%',
    borderColor: '#00703C',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    minHeight: 150, // Taller height for feedback input
    textAlignVertical: 'top',
  },
  button: {
    width: '100%',
    padding: 10,
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

export default FeedbackPage;
