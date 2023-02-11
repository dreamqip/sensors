import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { wsUrl } from '../utils/constants';

const socket = io(wsUrl, {
  reconnectionDelayMax: 10000,
  secure: true,
});

export interface SocketStore {
  socket: Socket;
}

export const useSocketStore = create<SocketStore>(() => ({
  socket,
}));