import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NotificationManager: React.FC = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (notification: {
      caseId: string;
      message: {
        text: string;
        sender: string;
        timestamp: string;
      };
    }) => {
      toast.info(`New message: ${notification.message.text.substring(0, 30)}...`);
    };

    const handleCaseUpdate = (update: { caseId: string; status: string }) => {
      toast.info(`Case status updated to ${update.status}`);
    };

    socket.on('newMessageNotification', handleNewMessage);
    socket.on('caseStatusUpdated', handleCaseUpdate);

    return () => {
      socket.off('newMessageNotification', handleNewMessage);
      socket.off('caseStatusUpdated', handleCaseUpdate);
    };
  }, [socket, navigate]);

  return null;
};

export default NotificationManager;
