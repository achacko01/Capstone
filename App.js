import { StatusBar, StyleSheet, View } from 'react-native'; // Import StatusBar from react-native
import LoginScreen from './LoginScreen';

export default function App() {
 return (
   <View style={styles.container}>
     <LoginScreen />
     <StatusBar style="auto" />
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
 },
});
