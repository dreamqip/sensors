import type { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useButchesStore } from '../store';

type Sensors = typeof Accelerometer | typeof Gyroscope | typeof Magnetometer;

const DEFAULT_SENSORS_DATA = {
  x: 0,
  y: 0,
  z: 0,
  timestamp: 0,
};
const SENSOR_UPDATE_INTERVAL = 16;
const BUTCHES_COUNT = 375;

export default function Sensor({ title, sensor, start }: { title: string, sensor: Sensors, start?: boolean }) {
  const [{ x, y, z, timestamp }, setData] = useState(DEFAULT_SENSORS_DATA);
  const [subscription, setSubscription] = useState<{ remove: () => void } | null | true>(null);
  const incrementButchesCount = useButchesStore(state => state.increment);
  let butchArray: [number, number, number, number][] = [];
  let nextIndex = 0;

  const _pushButch = (x: number, y: number, z: number, timestamp: number) => {
    butchArray[nextIndex] = [x, y, z, timestamp];
    nextIndex++;
  };

  const _fast = () => sensor.setUpdateInterval(SENSOR_UPDATE_INTERVAL);

  const _subscribe = () => {
    setSubscription(
      sensor.addListener(({ x, y, z }) => {
        setData({
            x,
            y,
            z,
            timestamp: new Date().getTime(),
          },
        );
        _pushButch(x, y, z, new Date().getTime());
        if (butchArray.length === BUTCHES_COUNT) {
          incrementButchesCount();
          butchArray = [];
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
    _fast();
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
  }
});