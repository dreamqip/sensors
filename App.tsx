import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBatchesStore } from './stores/batch.store';
import { useSocketStore } from './stores/socket.store';
import Sensor from './components/Sensor';

import 'expo-dev-client';
import { SOCKET_EVENTS } from './utils/constants';

export default function App() {
  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);
  const reset = useBatchesStore(state => state.reset);
  const count = useBatchesStore(state => state.count);
  const socket = useSocketStore(state => state.socket);
  const sequenceNumber = useRef(0);

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

  const _unsubscribe: () => void = useCallback(() => {
    useBatchesStore.subscribe((state) => [state.batchArray, state.count], (batch) => {
      const [batchArray] = batch;
      sequenceNumber.current += 1;
      socket.emit('send_batch', {
        timestamp: Date.now(),
        sequence_number: sequenceNumber.current,
        sensor_readings: batchArray,
      });
    });
  }, [socket, count]);

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

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('batch_response', (data) => {
      console.log('data from server', data);
    });

    socket.on(SOCKET_EVENTS.BATCH_REJECTED, (data) => {
      console.log('batch rejected', data);
    });

    // send each time a batch is changed in the store
    _unsubscribe();

    socket.on('error', (error) => {
      console.log('error', error);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
    });

    return () => {
      socket.disconnect();
      _unsubscribe();
    };

  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Sensor title='Accelerometer' sensor={Accelerometer} start={start} />
      <Sensor title='Gyroscope' sensor={Gyroscope} start={start} />
      <Sensor title='Magnetometer' sensor={Magnetometer} start={start} />
      <Button title={start ? 'Stop' : 'Start'} onPress={_toggle} />
      <View style={styles.rideInfo}>
        <View style={styles.rideInfoItem}>
          <Text style={styles.rideInfoItemText}>Batches count: {count}</Text>
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
