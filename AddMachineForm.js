import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const machineImages = [
  { name: 'Bench Press', collection: 'bench_press', image: require('./assets/Bench.jpeg') },
  { name: 'Bicep Curl', collection: 'bicep_curl', image: require('./assets/Bicep Curl.webp') },
  { name: 'Chest Press', collection: 'chest_press', image: require('./assets/Chest Press.jpeg') },
  { name: 'Hack Squat', collection: 'hack_squat', image: require('./assets/Hack Squat.webp') },
  { name: 'Lat Pulldown', collection: 'lat_pulldown', image: require('./assets/Lat Pulldown.webp') },
  { name: 'Leg Press', collection: 'leg_press', image: require('./assets/Leg Press.jpeg') },
  { name: 'Machine Row', collection: 'machine_row', image: require('./assets/Machine Row.webp') },
  { name: 'Squat Rack', collection: 'squat_rack', image: require('./assets/Squat Rack.png') },
];

const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const charactersLength = characters.length;
  const numbersLength = numbers.length;
  for (let i = 0; i < length; i++) {
    if (i < 2) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    } else {
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
  }
  return result;
};

const AddMachineForm = ({ navigation }) => {
  const handleAddMachine = async (machineName, collectionName) => {
    try {
      const db = firebase.firestore();
      const machinesRef = db.collection(collectionName);
      
      // Generate an ID for the new machine document
      const machineId = `${machineName.toLowerCase()}${generateRandomString(2)}${generateRandomString(3)}`;
      
      // Add the new machine document to the collection
      await machinesRef.doc(machineId).set({
        id: machineId,
        name: machineName,
        occupied: false
      });
      
      console.log(`Machine added: ${machineName}`);
      navigation.navigate('AddMachine'); // Navigate back to AddMachineForm after adding the machine
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {machineImages.map((machine, index) => (
          <TouchableOpacity key={index} style={styles.machineItem} onPress={() => handleAddMachine(machine.name, machine.collection)}>
            <Image source={machine.image} style={styles.machineImage} />
            <Text style={styles.machineName}>{machine.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddMachine')}>
        <Text style={styles.buttonText}>Done</Text>
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
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  machineItem: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  machineImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  machineName: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#00703C',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AddMachineForm;
