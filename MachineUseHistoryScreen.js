import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const MachineUseHistoryScreen = () => {
  const [machineUsageHistory, setMachineUsageHistory] = useState([]);

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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.machineId}>Machine ID: {item.machineId}</Text>
      <Text style={styles.usageCount}>Usage Count: {item.usageCount}</Text>
      <Text style={styles.date}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Machine Use History</Text>
      <FlatList
        data={machineUsageHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  machineId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  usageCount: {
    fontSize: 16,
    marginVertical: 4,
  },
  date: {
    fontSize: 14,
    color: '#888888',
  },
});

export default MachineUseHistoryScreen;
