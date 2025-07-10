import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiMessageSquare, FiSmile, FiSearch } from 'react-icons/fi';
import { useChatStore } from '../../store/chat/useChatStore';
import { useAgentCasesStore } from '../../store/agent/useAgentCasesStore';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { IMessage } from '@/Types/Icase';
import EmojiPicker from 'emoji-picker-react';
import Cookie from 'js-cookie';
import { useFetchAgentCases } from '@/hook/agent/useAgentCases';
import { useSocket } from '@/context/SocketContext';
import { User } from 'lucide-react';

const AgentChat: React.FC = () => {
  const { messages, activeCase, loading, setMessages, addMessage, setActiveCase, setError } =
    useChatStore();

  const { activeCases } = useAgentCasesStore();
  const userData = Cookie.get('userData');
  const user = userData ? JSON.parse(userData) : null;
  const agentId = user?.id;
  const { refetch: refetchCases } = useFetchAgentCases(agentId);

  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Filter and search cases
  const availableCases = activeCases
    .filter(caseItem => caseItem.status?.toLowerCase() === 'active')
    .filter(
      caseItem =>
        caseItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.issue.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Socket event handlers
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInitialMessages = (initialMessages: IMessage[]) => {
      setMessages(
        initialMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp || Date.now()),
        }))
      );
    };

    const handleNewMessage = (newMessage: IMessage) => {
      addMessage({
        ...newMessage,
        timestamp: new Date(newMessage.timestamp || Date.now()),
      });

      queryClient.invalidateQueries({ queryKey: ['agentCases'] });
    };

    const handleTyping = (data: { userId: string; name: string }) => {
      if (data.userId !== activeCase?.customer._id) return;
      setTypingAgent(data.name);
      setTimeout(() => setTypingAgent(null), 3000);
    };

    socket.on('initialMessages', handleInitialMessages);
    socket.on('receiveMessage', handleNewMessage);
    socket.on('userTyping', handleTyping);
    socket.on('error', (error: string) => setError(error));

    return () => {
      socket.off('initialMessages', handleInitialMessages);
      socket.off('receiveMessage', handleNewMessage);
      socket.off('userTyping', handleTyping);
      socket.off('error');
    };
  }, [socket, isConnected, activeCase]);

  // Auto-scroll and mark messages as read
  useEffect(() => {
    scrollToBottom();
    if (activeCase && socket && isConnected) {
      socket.emit('markMessagesRead', { caseId: activeCase._id });
    }
  }, [messages, activeCase]);

  // Join case room when active case changes
  useEffect(() => {
    if (activeCase && socket && isConnected) {
      socket.emit('joinCase', activeCase._id);
      refetchCases();
    }
  }, [activeCase, socket, isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !message.trim() || !socket || !isConnected) return;

    const newMessage: IMessage = {
      _id: '',
      sender: user.id,
      senderModel: user.role,
      text: message,
      caseId: activeCase._id,
      recipient: {
        _id: activeCase.customer._id,
        fullname: activeCase.customer.fullname,
        email: activeCase.customer.email,
        phone: activeCase.customer.phone,
      },
      timestamp: new Date(),
      read: false,
    };

    socket.emit('sendMessage', newMessage);
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    if (activeCase) {
      socket?.emit('typing', activeCase._id);
    }
  };

  const handleTyping = () => {
    if (activeCase && socket) {
      socket.emit('typing', activeCase._id);
    }
  };

  const formatTime = (date: Date) => format(date, 'h:mm a');
  const formatMessageDate = (date: Date) => format(date, 'MMMM d, yyyy');
  const formatLastSeen = (date: Date) => format(date, 'h:mm a');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Customer List */}
      <div className="w-1/3 flex flex-col border-r border-gray-300 bg-white">
        {/* Search Bar */}
        <div className="p-3 bg-gray-50">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full py-2 pl-10 pr-4 bg-white rounded-lg focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {availableCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <FiMessageSquare className="h-10 w-10 mb-2" />
              <p>No active conversations</p>
            </div>
          ) : (
            availableCases.map(caseItem => (
              <div
                key={caseItem._id}
                onClick={() => setActiveCase(caseItem)}
                className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  activeCase?._id === caseItem._id ? 'bg-blue-50' : ''
                }`}>
                <User name={caseItem.customerName} size="40" className="mr-3 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">{caseItem.customerName}</h3>
                    <span className="text-xs text-gray-500">
                      {formatLastSeen(new Date(caseItem.updatedAt || caseItem.createdAt))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">
                      {caseItem.issue.substring(0, 30)}...
                    </p>

                    {(caseItem.unreadCount ?? 0) > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {caseItem.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeCase ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-3 border-b border-gray-300 bg-gray-50">
              <User name={activeCase.customerName} size="40" className="mr-3 rounded-full" />
              <div className="flex-1">
                <h3 className="font-medium">{activeCase.customerName}</h3>
                <p className="text-xs text-gray-500">{typingAgent ? 'typing...' : 'Online'}</p>
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {activeCase.department}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FiMessageSquare className="h-10 w-10 mb-2" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, index) => {
                    const showDateHeader =
                      index === 0 ||
                      formatMessageDate(new Date(messages[index - 1].timestamp || 0)) !==
                        formatMessageDate(new Date(msg.timestamp || 0));

                    return (
                      <React.Fragment key={index}>
                        {showDateHeader && (
                          <div className="flex justify-center my-2">
                            <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {formatMessageDate(new Date(msg.timestamp || 0))}
                            </div>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            msg.senderModel === 'agent' ? 'justify-end' : 'justify-start'
                          }`}>
                          <div
                            className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                              msg.senderModel === 'agent'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow'
                            }`}>
                            <div className="text-sm">{msg.text}</div>
                            <div
                              className={`text-xs mt-1 text-right ${
                                msg.senderModel === 'agent' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                              {formatTime(new Date(msg.timestamp || 0))}
                              {msg.senderModel !== 'agent' && !msg.read && (
                                <span className="ml-1 text-blue-400">•</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 bg-white border-t border-gray-300">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-blue-500">
                  <FiSmile className="h-5 w-5" />
                </button>
                <button type="button" className="p-2 text-gray-500 hover:text-blue-500">
                  <FiPaperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSendMessage(e);
                    }
                  }}
                  className="flex-1 py-2 px-4 mx-2 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
                  placeholder="Type a message"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400">
                  <FiSend className="h-5 w-5" />
                </button>
              </form>
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <FiMessageSquare className="h-16 w-16 mb-4" />
            <h3 className="text-lg font-medium">No conversation selected</h3>
            <p className="text-sm">Select a customer from the sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentChat;
