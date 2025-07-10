import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../utils/api';
import Cookie from 'js-cookie';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected';
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionState: 'connecting',
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionState, setConnectionState] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');

  const token = Cookie.get('token');
  const userData = Cookie.get('userData');

  useEffect(() => {
    const socketURL =
      api.defaults.baseURL?.replace('/api', '') ||
      process.env.REACT_APP_API_URL ||
      'http://localhost:5173';

    const socketInstance = io(socketURL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const onConnect = () => {
      setConnectionState('connected');
    };

    const onDisconnect = () => {
      setConnectionState('disconnected');
    };

    const onConnectError = (error: Error) => {
      console.error('Socket connection error:', error);
      setConnectionState('disconnected');
    };

    const onReconnect = () => {
      setConnectionState('connected');
    };

    const onReconnectError = (error: Error) => {
      console.error('Socket reconnection error:', error);
    };

    const onReconnectFailed = () => {
      console.error('Socket reconnection failed after all attempts');
      setConnectionState('disconnected');
    };

    // Add all event listeners
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);
    socketInstance.on('reconnect', onReconnect);
    socketInstance.on('reconnect_error', onReconnectError);
    socketInstance.on('reconnect_failed', onReconnectFailed);

    setSocket(socketInstance);
    setConnectionState('connecting');

    return () => {
      console.log('SocketProvider - Cleaning up socket connection');
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      socketInstance.off('reconnect', onReconnect);
      socketInstance.off('reconnect_error', onReconnectError);
      socketInstance.off('reconnect_failed', onReconnectFailed);
      socketInstance.disconnect();
    };
  }, [token, userData]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected: connectionState === 'connected', connectionState }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
