import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const machineData = [
  { name: 'Bench Press', collection: 'bench_press', image: require('./assets/Bench.jpeg') },
  { name: 'Bicep Curl', collection: 'bicep_curl', image: require('./assets/Bicep Curl.webp') },
  { name: 'Chest Press', collection: 'chest_press', image: require('./assets/Chest Press.jpeg') },
  { name: 'Hack Squat', collection: 'hack_squat', image: require('./assets/Hack Squat.webp') },
  { name: 'Lat Pulldown', collection: 'lat_pulldown', image: require('./assets/Lat Pulldown.webp') },
  { name: 'Leg Press', collection: 'leg_press', image: require('./assets/Leg Press.jpeg') },
  { name: 'Squat Rack', collection: 'squat_rack', image: require('./assets/Squat Rack.png') },
];

const RemoveMachineScreen = ({ navigation }) => {
  const [machineDataWithStatus, setMachineDataWithStatus] = useState([]);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const machineDataWithStatus = await Promise.all(
          machineData.map(async ({ name, collection }) => {
            const querySnapshot = await firebase.firestore().collection(collection).get();
            const machines = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name,
                occupied: data.occupied,
              };
            });
            return { name, collection, machines };
          })
        );
        setMachineDataWithStatus(machineDataWithStatus);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    fetchMachineData();
  }, []);

  const removeMachine = async (collection, machineId) => {
    try {
      await firebase.firestore().collection(collection).doc(machineId).delete();
      // Remove the machine from state to reflect the change immediately
      setMachineDataWithStatus(prevState =>
        prevState.map(group => ({
          ...group,
          machines: group.machines.filter(machine => machine.id !== machineId),
        }))
      );
    } catch (error) {
      console.error('Error removing machine:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {machineDataWithStatus.map(({ name, collection, machines }) => (
        <View key={name} style={styles.machineGroup}>
          <Text style={styles.machineGroupName}>{name}</Text>
          {machines.map(machine => (
            <View key={machine.id} style={styles.machineItem}>
              <Image source={machineData.find(m => m.name === name).image} style={styles.machineImage} />
              <View style={styles.machineDetails}>
                <Text style={styles.machineName}>{machine.id}</Text>
                <Text style={styles.machineAvailability}>{machine.occupied ? 'In Use' : 'Available'}</Text>
              </View>
              <TouchableOpacity onPress={() => removeMachine(collection, machine.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
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
  machineAvailability: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RemoveMachineScreen;
