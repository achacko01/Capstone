import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const machines = [
  { id: 'machine1', name: 'Squat Rack', image: require('./assets/SquatRack.png') },
  { id: 'machine2', name: 'Bench', image: require('./assets/Bench.jpeg') },
  { id: 'machine3', name: 'Hack Squat', image: require('./assets/HackSquat.webp') },
  { id: 'machine4', name: 'Leg Press', image: require('./assets/LegPress.jpeg') },
  { id: 'machine5', name: 'Chest Press', image: require('./assets/ChestPress.jpeg') },
  { id: 'machine6', name: 'Lat Pulldown', image: require('./assets/LatPulldown.webp') },
  { id: 'machine7', name: 'Machine Row', image: require('./assets/MachineRow.webp') },
  { id: 'machine8', name: 'Preacher Curl', image: require('./assets/BicepCurl.webp') },
];

const MachineUseHistoryScreen = () => {
  const [machineUsageHistory, setMachineUsageHistory] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);

  useEffect(() => {
    fetchMachineUsageHistory();
  }, []);

  const fetchMachineUsageHistory = async () => {
    try {
      const snapshot = await firebase.firestore().collection('machineUsageHistory').get();
      const usageHistory = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMachineUsageHistory(usageHistory);
    } catch (error) {
      console.error('Error fetching machine usage history:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp instanceof firebase.firestore.Timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleString();
    } else if (typeof timestamp === 'string') {
      return timestamp;
    } else {
      return 'Invalid Timestamp';
    }
  };

  const renderMachineItem = ({ item }) => (
    <TouchableOpacity style={styles.machineCard} onPress={() => setSelectedMachine(item)}>
      <Image source={item.image} style={styles.machineImage} />
      <Text style={styles.machineName}>{item.name}</Text>
      <Text style={styles.seeHistoryButton}>See History</Text>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.reservationItem}>
      <Text style={styles.userId}>User ID: {item.userId}</Text>
      <View style={styles.reservationTimeInfo}>
        <Text style={styles.timeLabel}>Start Time:</Text>
        <Text style={styles.startTime}>{formatTimestamp(item.startTime)}</Text>
      </View>
      <View style={styles.reservationTimeInfo}>
        <Text style={styles.timeLabel}>End Time:</Text>
        <Text style={styles.endTime}>{formatTimestamp(item.endTime)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Machine Use History</Text>
      {!selectedMachine ? (
        <FlatList
          data={machines}
          renderItem={renderMachineItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.machineList}
        />
      ) : (
        <View style={styles.historyContainer}>
          <Text style={styles.machineId}>{selectedMachine.name}</Text>
          <FlatList
            data={machineUsageHistory.find((item) => item.machineId === selectedMachine.id)?.reservations || []}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `${selectedMachine.id}-${index}`}
            contentContainerStyle={styles.historyList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9DADE',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  machineList: {
    paddingBottom: 16,
  },
  machineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    elevation: 2,
    padding: 16,
    alignItems: 'center',
    width: '45%',
  },
  machineImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  machineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  seeHistoryButton: {
    fontSize: 14,
    color: '#00703C',
    textDecorationLine: 'underline',
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    padding: 16,
  },
  machineId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyList: {
    paddingBottom: 16,
  },
  reservationItem: {
    backgroundColor: '#F2F2F2',
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
  },
  userId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reservationTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  startTime: {
    fontSize: 14,
  },
  endTime: {
    fontSize: 14,
  },
});

export default MachineUseHistoryScreen;
