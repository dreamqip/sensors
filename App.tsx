import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { useButchesStore } from './store';
import Sensor from './components/Sensor';

export default function App() {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);
  const { butchesCount, reset } = useButchesStore();

  const _toggle = () => {
    if (start) {
      Alert.alert('Stop', 'Do you want to stop sensors?', [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => setStart(false) },
      ]);
    } else {
      setStart(!start);
    }
  };

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
        setTime(0);
        reset();
      };
    }
  }, [start]);

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Sensor title='Accelerometer' sensor={Accelerometer} start={start} />
      <Sensor title='Gyroscope' sensor={Gyroscope} start={start} />
      <Sensor title='Magnetometer' sensor={Magnetometer} start={start} />
      <Button title={start ? 'Stop' : 'Start'} onPress={_toggle} />
      <View style={styles.rideInfo}>
        <View style={styles.rideInfoItem}>
          <Text style={styles.rideInfoItemText}>Butches count: {butchesCount}</Text>
        </View>
        <View style={styles.rideInfoItem}>
          <Text style={styles.rideInfoItemText}>
            Ride time: {time}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rideInfo: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  rideInfoItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
  rideInfoItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});
