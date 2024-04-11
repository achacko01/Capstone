import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import firebase from 'firebase/compat/app'; // Make sure to import firebase
import 'firebase/compat/firestore'; // Import Firestore

const FeedbackPage = ({ navigation }) => {
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = async () => {
    if (feedbackText.trim() === '') {
      Alert.alert('Feedback is empty', 'Please enter your feedback before submitting.');
      return;
    }
  
    try {
      const feedbackRef = firebase.firestore().collection('feedback');
      await feedbackRef.add({
        text: feedbackText, // Changed key to 'text' for clarity
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Add timestamp
      });
      Alert.alert("Feedback Submitted");
      setFeedbackText(''); // Clear the feedback text
      navigation.goBack(); // Navigate back after submission
    } catch (error) {
      console.error(error);
      Alert.alert("Feedback Submission Failed", "Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your feedback here..."
        onChangeText={setFeedbackText} // Update to use the renamed state variable
        value={feedbackText} // Update to use the renamed state variable
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
    justifyContent: 'center', // Adjusts the alignment to the start
    alignItems: 'center',
    padding: 20, // Reduced padding/margin at the top to move content up
    backgroundColor: '#D9DADE',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    borderColor: '#00703C',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    minHeight: 150,
    textAlignVertical: 'top', // Ensures text starts from the top in multiline TextInput
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
