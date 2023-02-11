// This is the URL of the server that will be used to connect to the websocket,
// I'm using a local IP address here cause with localhost it doesn't work
// Change this to your server's IP address

export const wsUrl = 'http://192.168.1.100:8080';

export const BATCH_SIZE = 150;

export const SENSOR_UPDATE_INTERVAL = 16;

export const DEFAULT_SENSORS_DATA = {
  x: 0,
  y: 0,
  z: 0,
  timestamp: 0,
};

export const SENSORS_IDS = {
  Accelerometer: 0,
  Gyroscope: 1,
  Magnetometer: 2,
} as const;

export const SOCKET_EVENTS = {
  BATCH_ACCEPTED: 'batch_accepted',
  BATCH_REJECTED: 'batch_rejected',
} as const;
