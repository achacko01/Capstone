import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const machines = [
  { name: 'Squat Rack', image: require('./assets/Squat Rack.png') },
  { name: 'Bench', image: require('./assets/Bench.jpeg') },
  { name: 'Hack Squat', image: require('./assets/Hack Squat.webp') },
  { name: 'Leg Press', image: require('./assets/Leg Press.jpeg') },
  { name: 'Chest Press', image: require('./assets/Chest Press.jpeg') },
  { name: 'Lat Pulldown', image: require('./assets/Lat Pulldown.webp') },
  { name: 'Machine Row', image: require('./assets/Machine Row.webp') },
  { name: 'Preacher Curl', image: require('./assets/Bicep Curl.webp') },
];

const ReservationPage = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Reserve a Machine</Text>
      {machines.map((machine, index) => (
        <View key={index} style={styles.machineCard}>
          <Image source={machine.image} style={styles.machineImage} />
          <Text style={styles.machineName}>{machine.name}</Text>
          <TouchableOpacity style={styles.reserveButton} onPress={() => console.log('Reserve', machine.name)}>
            <Text style={styles.reserveButtonText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D9DADE',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pageTitle: {
    fontSize: 24,
    color: '#000',
    marginVertical: 20,
  },
  machineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    padding: 10,
  },
  machineImage: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  machineName: {
    fontSize: 18,
    color: '#00703C',
    marginBottom: 10,
  },
  reserveButton: {
    backgroundColor: '#00703C',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ReservationPage;
