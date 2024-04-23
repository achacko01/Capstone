import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const machineData = [
  { name: 'Bench Press', collection: 'bench_press', image: require('./assets/Bench.jpeg') },
  { name: 'Bicep Curl', collection: 'bicep_curl', image: require('./assets/BicepCurl.webp') },
  { name: 'Chest Press', collection: 'chest_press', image: require('./assets/ChestPress.jpeg') },
  { name: 'Hack Squat', collection: 'hack_squat', image: require('./assets/HackSquat.webp') },
  { name: 'Lat Pulldown', collection: 'lat_pulldown', image: require('./assets/LatPulldown.webp') },
  { name: 'Leg Press', collection: 'leg_press', image: require('./assets/LegPress.jpeg') },
  { name: 'Squat Rack', collection: 'squat_rack', image: require('./assets/SquatRack.png') },
];

const AddMachineScreen = ({ navigation }) => {
  const [machineDataWithStatus, setMachineDataWithStatus] = useState([]);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const machineDataWithStatus = await Promise.all(
          machineData.map(async ({ name, collection }) => {
            const querySnapshot = await firebase.firestore().collection(collection).get();
            const machines = querySnapshot.docs.map((doc, index) => {
              const data = doc.data();
              return {
                id: `${name}#${index + 1}`, // Append order number to machine name
                name: data.name,
                machineId: doc.id, // Add machine ID
                occupied: data.occupied,
              };
            });
            return { name, machines };
          })
        );
        setMachineDataWithStatus(machineDataWithStatus);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    fetchMachineData();
  }, []);

  const handleAddMachine = () => {
    navigation.navigate('AddMachineForm');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {machineDataWithStatus.map(({ name, machines }) => (
        <View key={name} style={styles.machineGroup}>
          <Text style={styles.machineGroupName}>{name}</Text>
          {machines.map(machine => (
            <TouchableOpacity key={machine.id} style={styles.machineItem}>
              <Image source={machineData.find(m => m.name === name).image} style={styles.machineImage} />
              <View style={styles.machineDetails}>
                <Text style={styles.machineName}>{machine.id}</Text>
                <Text style={styles.machineId}>ID: {machine.machineId}</Text>
                <Text style={styles.machineAvailability}>{machine.occupied ? 'In Use' : 'Available'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddMachine}>
        <Text style={styles.buttonText}>Add Machine</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D9DADE',
    paddingVertical: 20,
  },
  machineGroup: {
    marginBottom: 20,
  },
  machineGroupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  machineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  machineImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  machineDetails: {
    flex: 1,
  },
  machineName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  machineId: {
    fontSize: 14,
    color: '#666',
  },
  machineAvailability: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#00703C',
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AddMachineScreen;
