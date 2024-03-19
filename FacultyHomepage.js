import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const FacultyHomepage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Faculty Portal</Text>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Add Machine')}>
        <Text style={styles.buttonText}>Add Machine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Remove Machine')}>
        <Text style={styles.buttonText}>Remove Machine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Machine Use History')}>
        <Text style={styles.buttonText}>Machine Use History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => console.log('View Users')}>
        <Text style={styles.buttonText}>View Users</Text>
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

export default FacultyHomepage;
