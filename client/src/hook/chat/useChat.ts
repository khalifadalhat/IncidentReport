import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../context/SocketContext';
import { IMessage } from '../../Types/Icase';
import api from '../../utils/api';
import Cookie from 'js-cookie';

export const useChat = (caseId?: string) => {
  const { socket, isConnected } = useSocket();
  const userData = Cookie.get('userData');
  const user = userData ? JSON.parse(userData) : null;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load initial messages
  useEffect(() => {
    if (!caseId) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${caseId}`);
        setMessages(response.data.messages);

        // Mark messages as read
        if (socket && isConnected) {
          socket.emit('markMessagesRead', { caseId });
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, [caseId, socket, isConnected]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !caseId) return;

    const handleNewMessage = (message: IMessage) => {
      setMessages(prev => [...prev, message]);

      // Update unread count if message is for current user
      if (message.recipient === user?.id && !message.read) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleMessagesRead = ({
      caseId: readCaseId,
      userId,
    }: {
      caseId: string;
      userId: string;
    }) => {
      if (readCaseId === caseId && userId !== user?.id) {
        setMessages(prev =>
          prev.map(msg => (msg.recipient === user?.id ? { ...msg, read: true } : msg))
        );
      }
    };

    const handleTyping = (typingData: { userId: string; name: string }) => {
      if (typingData.userId !== user?.id) {
        setTypingUsers(prev => [...prev, typingData.name]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(name => name !== typingData.name));
        }, 3000);
      }
    };

    socket.on('receiveMessage', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('userTyping', handleTyping);
    };
  }, [socket, caseId, user?.id]);

  // Send message handler
  const sendMessage = useCallback(
    async (text: string) => {
      if (!socket || !caseId || !text.trim()) return;

      const messageData = {
        text,
        caseId,
        timestamp: new Date().toISOString(),
      };

      socket.emit('sendMessage', messageData);
    },
    [socket, caseId]
  );

  // Typing indicator handler
  const sendTypingIndicator = useCallback(() => {
    if (socket && caseId) {
      socket.emit('typing', caseId);
    }
  }, [socket, caseId]);

  return {
    messages,
    sendMessage,
    typingUsers,
    sendTypingIndicator,
    unreadCount,
    markAsRead: () => {
      if (socket && caseId) {
        socket.emit('markMessagesRead', { caseId });
        setUnreadCount(0);
      }
    },
  };
};
