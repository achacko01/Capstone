import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const FeedbackPage = ({ navigation }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend or Firebase
    // After submitting, you can navigate back or show a confirmation message
    Alert.alert("Feedback Submitted");
    console.log(feedback);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your feedback here..."
        onChangeText={setFeedback}
        value={feedback}
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
