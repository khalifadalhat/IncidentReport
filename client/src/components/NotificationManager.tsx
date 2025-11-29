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
      toast.info(
        `New message: ${notification.message.text.substring(0, 40)}...`,
        {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => navigate(`/cases/${notification.caseId}`),
          },
        }
      );
    };

    const handleCaseStatusUpdate = (update: { 
      caseId: string; 
      status: string;
      caseTitle?: string;
    }) => {
      toast.info(
        `Case "${update.caseTitle || 'Unknown'}" status: ${update.status}`,
        {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => navigate(`/cases/${update.caseId}`),
          },
        }
      );
    };

    const handleAgentAssigned = (data: {
      caseId: string;
      agentName: string;
      agentId: string;
      caseTitle: string;
    }) => {
      toast.success(
        `Agent ${data.agentName} has been assigned to your case: "${data.caseTitle}"`,
        {
          duration: 6000,
          action: {
            label: 'View Case',
            onClick: () => navigate(`/cases/${data.caseId}`),
          },
        }
      );
    };

    const handleCaseAssigned = (data: {
      caseId: string;
      caseTitle: string;
      customerName: string;
    }) => {
      toast.info(
        `New case assigned: "${data.caseTitle}" from ${data.customerName}`,
        {
          duration: 6000,
          action: {
            label: 'View Case',
            onClick: () => navigate(`/cases/${data.caseId}`),
          },
        }
      );
    };

    socket.on('newMessageNotification', handleNewMessage);
    socket.on('caseStatusUpdated', handleCaseStatusUpdate);
    socket.on('agentAssigned', handleAgentAssigned);
    socket.on('caseAssigned', handleCaseAssigned);

    return () => {
      socket.off('newMessageNotification', handleNewMessage);
      socket.off('caseStatusUpdated', handleCaseStatusUpdate);
      socket.off('agentAssigned', handleAgentAssigned);
      socket.off('caseAssigned', handleCaseAssigned);
    };
  }, [socket, navigate]);

  return null;
};

export default NotificationManager;