import React, { useState, useEffect } from 'react';
//import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { firebase } from './firebase';

const db = firebase.firestore();

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

const ReservationPage = ({ navigation }) => {
const [reservationTime, setReservationTime] = useState(0); // Track reserved time
const [reservedMachine, setReservedMachine] = useState(null); // Track the reserved machine
const [queueInfo, setQueueInfo] = useState({}); // Track queue information for each machine
const [reservationEndTime, setReservationEndTime] = useState(null); // Add this line


useEffect(() => {
// Fetch queue information for all machines when the component mounts
fetchQueueInfo();
// Check if the allMachinesQueue document exists
checkDocumentExists();

const unsubscribe = db.collection('queues').doc('allMachinesQueue').onSnapshot((doc) => {
  setQueueInfo(doc.exists ? doc.data() : {});
});

// Unsubscribe from real-time updates when the component unmounts
return () => unsubscribe();
}, []);

// Function to fetch queue information for all machines
const fetchQueueInfo = async () => {
try {
  const machinesSnapshot = await db.collection('queues').doc('allMachinesQueue').get();
  const queueInfo = machinesSnapshot.exists ? machinesSnapshot.data() : {};
  setQueueInfo(queueInfo);
} catch (error) {
  console.error('Error fetching queue information:', error);
}
};

// Function to handle reserving a machine with custom time
const reserveMachine = (machine) => {
const currentUserUid = firebase.auth().currentUser.uid;

// Check if the current user has an active reservation
db.collection('reservations')
   .where('userId', '==', currentUserUid)
   .where('endTime', '>', firebase.firestore.Timestamp.now())
   .get()
   .then((querySnapshot) => {
       if (!querySnapshot.empty) {
           // User already has an active reservation
           Alert.alert(
               'Already Reserved',
               'You already have a reservation. You cannot make another reservation until your current one expires.'
           );
       } else {
           // User does not have an active reservation, proceed with reservation
           db.collection('reservations')
               .where('machineId', '==', machine.id)
               .where('endTime', '>', firebase.firestore.Timestamp.now())
               .orderBy('endTime', 'desc')
               .limit(1)
               .get()
               .then((reservationSnapshot) => {
                   if (!reservationSnapshot.empty) {
                       const nextReservation = reservationSnapshot.docs[0].data();
                       const nextAvailableTime = new Date(nextReservation.endTime.toMillis());
                       Alert.alert(
                           'Machine is Booked',
                           `This machine is already reserved until ${nextAvailableTime.toLocaleTimeString()}. Would you like to reserve for the next available time?`,
                           [
                               { text: 'Cancel', style: 'cancel' },
                               {
                                   text: 'Reserve at Next Available Time',
                                   onPress: () => reserveAtNextAvailableTime(machine, nextAvailableTime),
                               },
                           ]
                       );
                   } else {
                       // No existing reservation
                       console.log("Machine is available for reservation");
                       promptReservationTime(machine);
                   }
               })
               .catch((error) => {
                   console.error('Error checking existing reservations:', error);
               });
       }
   })
   .catch((error) => {
       console.error('Error checking user reservations:', error);
   });
};

const promptReservationTime = (machine) => {
Alert.prompt(
 'Enter Reservation Time',
 'Enter the desired reservation time in minutes (max 30 minutes):',
 [
   {
     text: 'Cancel',
     style: 'cancel',
   },
   {
     text: 'OK',
     onPress: (input) => {
       handleReservationTimeInput(machine, input);
     },
   },
 ],
 'plain-text'
);
};

const handleReservationTimeInput = (machine, input) => {
const time = parseInt(input);
if (!isNaN(time) && time > 0 && time <= 30) {
 setReservationTime(time);
 checkAndMakeReservation(machine, time);
} else {
 Alert.alert('Invalid Input', 'Please enter a valid number between 1 and 30.');
}
};

const checkAndMakeReservation = (machine, time) => {
  db.collection('reservations')
    .where('machineId', '==', machine.id)
    .orderBy('endTime', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      let nextAvailableTime = new Date();
      if (!querySnapshot.empty) {
        const lastReservation = querySnapshot.docs[0].data();
        nextAvailableTime = new Date(lastReservation.endTime.toMillis());
      }

      const startTime = nextAvailableTime.toLocaleString('en-US', { timeZone: 'America/New_York' });
      const endTime = firebase.firestore.Timestamp.fromDate(new Date(nextAvailableTime.getTime() + time * 60000));

      db.collection('reservations')
        .add({
          userId: firebase.auth().currentUser.uid,
          machineId: machine.id,
          startTime: startTime,
          endTime: endTime,
        })
        .then(() => {
          console.log('Reservation added to Firestore');
          addToQueue(machine.id, time);
          updateMachineUsageHistory(machine.id, startTime, endTime, firebase.auth().currentUser.uid);
          setReservationEndTime(endTime.toMillis());
          scheduleRemoveFromQueue(machine.id, endTime.toMillis());
        })
        .catch((error) => {
          console.error('Error adding reservation: ', error);
        });
    })
    .catch((error) => {
      console.error('Error fetching existing reservations: ', error);
    });
};

const scheduleRemoveFromQueue = (machineId, endTimeMillis) => {
  const userId = firebase.auth().currentUser.uid;
  const delay = endTimeMillis - Date.now();

  setTimeout(() => {
    removeFromQueue(machineId, userId);
  }, delay);
};


const updateMachineUsageHistory = async (machineId, startTime, endTime, userId) => {
  const currentDate = new Date(startTime).toDateString();

  try {
    const machineUsageHistoryRef = db.collection('machineUsageHistory').doc(`${machineId}_${currentDate}`);
    const doc = await machineUsageHistoryRef.get();

    const reservationData = {
      machineId,
      userId,
      startTime,
      endTime,
    };

    if (doc.exists) {
      // Document exists, add the new reservation to the reservations array
      const currentReservations = doc.data().reservations || [];
      await machineUsageHistoryRef.update({
        reservations: [...currentReservations, reservationData],
      });
    } else {
      // Document doesn't exist, create a new one with the reservation data
      await machineUsageHistoryRef.set({
        machineId,
        reservations: [reservationData],
        date: currentDate,
      });
    }
  } catch (error) {
    console.error('Error updating machine usage history:', error);
  }
};

const reserveAtNextAvailableTime = (machine, nextAvailableTime) => {
  db.collection('reservations')
    .where('machineId', '==', machine.id)
    .orderBy('endTime', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      let updatedNextAvailableTime = new Date();
      if (!querySnapshot.empty) {
        const lastReservation = querySnapshot.docs[0].data();
        const lastReservationEndTime = new Date(lastReservation.endTime.toMillis());
        updatedNextAvailableTime = new Date(Math.max(updatedNextAvailableTime.getTime(), lastReservationEndTime.getTime()));
      }
      const formattedTime = updatedNextAvailableTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
      Alert.prompt(
        'Enter Reservation Time',
        `The machine is available at ${formattedTime}. Enter the desired reservation time in minutes (max 30 minutes):`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (input) => {
              handleReservationTimeInput(machine, input, updatedNextAvailableTime);
            },
          },
        ],
        'plain-text'
      );
    })
    .catch((error) => {
      console.error('Error fetching existing reservations: ', error);
    });
};
   

const addToQueue = (machineId, time) => {
  const userId = firebase.auth().currentUser.uid;

  db.collection('queues')
    .doc('allMachinesQueue')
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        db.collection('queues')
          .doc('allMachinesQueue')
          .update({
            [`${machineId}.users`]: firebase.firestore.FieldValue.arrayUnion(userId),
          })
          .then(() => {
            console.log('User added to the queue for machine:', machineId);
            fetchQueueInfo();
          })
          .catch((error) => {
            console.error('Error adding user to the queue:', error);
          });
      } else {
        db.collection('queues')
          .doc('allMachinesQueue')
          .set({ [machineId]: { users: [userId] } })
          .then(() => {
            console.log('Document created and user added to the queue for machine:', machineId);
            fetchQueueInfo();
          })
          .catch((error) => {
            console.error('Error creating document and adding user to the queue:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error checking document existence:', error);
    });
};

const removeFromQueue = (machineId, userId) => {
  db.collection('queues').doc('allMachinesQueue').update({
    [`${machineId}.users`]: firebase.firestore.FieldValue.arrayRemove(userId)
  })
  .then(() => {
    console.log('User removed from the queue for machine:', machineId);
    fetchQueueInfo();
    checkQueueAndPromptExtension(machineId); // Call the function here
  })
  .catch((error) => {
    console.error('Error removing user from the queue:', error);
  });
};


const checkQueueAndPromptExtension = (machineId) => {
  const userId = firebase.auth().currentUser.uid;
  db.collection('queues').doc('allMachinesQueue').get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        const machineQueue = docSnapshot.data()[machineId];
        if (machineQueue && machineQueue.users.length === 0) {
          // Check if the current user is the one whose reservation just ended
          db.collection('reservations')
            .where('machineId', '==', machineId)
            .where('userId', '==', userId)
            .orderBy('endTime', 'desc')
            .limit(1)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                // The current user's reservation just ended, prompt to extend
                promptExtendSession(machineId);
              }
            })
            .catch((error) => {
              console.error('Error checking user reservation:', error);
            });
        }
      }
    })
    .catch((error) => {
      console.error('Error checking queue:', error);
    });
};

// Function to prompt the user to extend their session
const promptExtendSession = (machineId) => {
  const userId = firebase.auth().currentUser.uid;
  db.collection('reservations')
    .where('machineId', '==', machineId)
    .where('userId', '==', userId)
    .orderBy('endTime', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // The current user's reservation just ended
        Alert.alert(
          'Extend Session',
          'Your reservation has ended, and there is no one else in the queue. Would you like to extend your session?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => handleExtendSession(machineId) },
          ]
        );
      }
    })
    .catch((error) => {
      console.error('Error checking user reservation:', error);
    });
};

// Function to handle the user's response to extend their session
const handleExtendSession = (machineId) => {
  Alert.prompt(
    'Enter Extension Time',
    'Enter the desired extension time in minutes (max 30 minutes):',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: (input) => handleExtensionTimeInput(machineId, input) },
    ],
    'plain-text'
  );
};

// Function to handle the user's input for the extension time
const handleExtensionTimeInput = (machineId, input) => {
  const time = parseInt(input);
  if (!isNaN(time) && time > 0 && time <= 30) {
    extendReservation(machineId, time);
  } else {
    Alert.alert('Invalid Input', 'Please enter a valid number between 1 and 30.');
  }
};

// Function to extend the user's reservation
const extendReservation = (machineId, time) => {
  const userId = firebase.auth().currentUser.uid;
  db.collection('reservations')
    .where('userId', '==', userId)
    .where('machineId', '==', machineId)
    .orderBy('endTime', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const reservation = querySnapshot.docs[0].data();
        const currentEndTime = reservation.endTime.toMillis();
        const newEndTime = firebase.firestore.Timestamp.fromDate(new Date(currentEndTime + time * 60000));
        db.collection('reservations').doc(querySnapshot.docs[0].id)
          .update({ endTime: newEndTime })
          .then(() => {
            console.log('Reservation extended successfully');
            addToQueue(machineId, time);
            scheduleRemoveFromQueue(machineId, newEndTime.toMillis()); // Schedule removal from queue with the new end time
          })
          .catch((error) => {
            console.error('Error updating reservation:', error);
          });
      } else {
        console.error('No active reservation found for the current user and machine');
      }
    })
    .catch((error) => {
      console.error('Error fetching reservation:', error);
    });
};


const checkDocumentExists = () => {
db.collection('queues').doc('allMachinesQueue').get()
  .then((docSnapshot) => {
    if (docSnapshot.exists) {
      console.log('Document exists:', docSnapshot.id);
    } else {
      console.log('Document does not exist:', docSnapshot.id);
    }
  })
  .catch((error) => {
    console.error('Error checking document existence:', error);
  });
};

return (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.pageTitle}>Reserve a Machine</Text>
    {machines.map((machine, index) => (
      <View key={index} style={styles.machineCard}>
        <Image source={machine.image} style={styles.machineImage} />
        <Text style={styles.machineName}>{machine.name}</Text>
        <TouchableOpacity style={styles.reserveButton} onPress={() => { reserveMachine(machine); }}>
          <Text style={styles.reserveButtonText}>Reserve</Text>
        </TouchableOpacity>
        {/* Display queue information */}
        <View style={styles.queueInfo}>
          {/* Display number of users in the queue */}
          <Text>Queue: {queueInfo[machine.id] && queueInfo[machine.id].users ? queueInfo[machine.id].users.length : 0} users</Text>
        </View>
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
queueInfo: {
marginTop: 10,
alignItems: 'center',
},
});

export default ReservationPage;
