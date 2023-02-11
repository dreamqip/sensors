import type { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { type SensorReading, useBatchesStore } from '../stores/batch.store';
import { BATCH_SIZE, DEFAULT_SENSORS_DATA, SENSOR_UPDATE_INTERVAL, SENSORS_IDS } from '../utils/constants';

type SensorsInstances = typeof Accelerometer | typeof Gyroscope | typeof Magnetometer;

export default function Sensor({
                                 title,
                                 sensor,
                                 start,
                               }: { title: 'Accelerometer' | 'Gyroscope' | 'Magnetometer', sensor: SensorsInstances, start?: boolean }) {
  const [{ x, y, z, timestamp }, setData] = useState(DEFAULT_SENSORS_DATA);
  const [subscription, setSubscription] = useState<{ remove: () => void } | null | true>(null);
  const incrementCount = useBatchesStore(state => state.increment);
  const updateBatch = useBatchesStore(state => state.updateBatchArray);
  let localBatchArray: SensorReading[] = [];
  let nextIndex = 0;

  const _pushButch = (data: { timestamp: number, sensor_id: 0 | 1 | 2, x: number, y: number, z: number }) => {
    const { x, y, z, timestamp, sensor_id } = data;
    localBatchArray[nextIndex] = [timestamp, sensor_id, x, y, z];
    nextIndex++;
  };

  const _fastUpdate = () => sensor.setUpdateInterval(SENSOR_UPDATE_INTERVAL);

  const _subscribe = () => {
    setSubscription(
      sensor.addListener(({ x, y, z }) => {
        const dataToSave = {
          timestamp: Date.now(),
          sensor_id: SENSORS_IDS[title],
          x,
          y,
          z,
        };
        setData(dataToSave);
        _pushButch(dataToSave);
        if (localBatchArray.length === BATCH_SIZE) {
          incrementCount();
          updateBatch(localBatchArray);
          localBatchArray = [];
          nextIndex = 0;
        }
      }));
  };

  const _unsubscribe = () => {
    if (subscription && typeof subscription !== 'boolean') {
      subscription.remove();
    }
    setSubscription(null);
    setData(DEFAULT_SENSORS_DATA);
  };

  useEffect(() => {
    _fastUpdate();
    if (start) {
      _subscribe();
    } else {
      _unsubscribe();
    }
    return () => _unsubscribe();
  }, [start]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.sensorBlock}>
        <Text style={styles.sensorText}>X-axis: {x}</Text>
      </View>
      <View style={styles.sensorBlock}>
        <Text style={styles.sensorText}>Y-axis: {y}</Text>
      </View>
      <View style={styles.sensorBlock}>
        <Text style={styles.sensorText}>Z-axis: {z}</Text>
      </View>
      <View style={styles.sensorBlock}>
        <Text style={styles.sensorText}>Timestamp: {timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderColor: '#60a5fa',
    borderRadius: 8,
    backgroundColor: '#171717',
    padding: 10,
    margin: 10,
    width: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  sensorBlock: {
    marginTop: 4,
  },
  sensorText: {
    fontSize: 16,
    color: '#f8fafc',
  },
});