import io from 'socket.io-client';

const socket = io('http://192.168.0.168:5000', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

export default socket;
