import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiPaperclip, FiMessageSquare, FiSmile, FiSearch } from 'react-icons/fi';
import { useCustomerStore } from '../../store/customer/useCustomerStore';
import api from '../../utils/api';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '@/context/SocketContext';
import { User } from 'lucide-react';

interface Message {
  _id?: string;
  sender: string;
  text: string;
  timestamp: Date;
  read?: boolean;
}

interface Agent {
  _id: string;
  fullname: string;
  department: string;
  isActive: boolean;
  lastActive?: Date;
}

interface CaseDetails {
  _id: string;
  customerName: string;
  department: string;
  issue: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ChatWithAgent: React.FC = () => {
  const { caseId } = useCustomerStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();

  // Fetch case details
  const { data: caseDetails } = useQuery<CaseDetails>({
    queryKey: ['caseDetails', caseId],
    queryFn: async () => {
      const response = await api.get(`/cases/${caseId}`);
      return response.data;
    },
    enabled: !!caseId,
  });

  // Fetch agents
  const { data: agentList = [] } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await api.get('/agents/available');
      return response.data.map((agent: Agent) => ({
        ...agent,
        lastActive: new Date(),
      }));
    },
  });

  // Filter agents based on search term
  const filteredAgents = agentList.filter(
    agent =>
      agent.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize socket connection
  useEffect(() => {
    if (!socket || !isConnected || !caseId) return;

    const handleInitialMessages = (initialMessages: Message[]) => {
      setMessages(
        initialMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    };

    const handleNewMessage = (newMessage: Message) => {
      setMessages(prev => [
        ...prev,
        {
          ...newMessage,
          timestamp: new Date(newMessage.timestamp),
        },
      ]);
    };

    socket.on('initialMessages', handleInitialMessages);
    socket.on('receiveMessage', handleNewMessage);

    // Join the case room
    socket.emit('joinCase', caseId);

    return () => {
      socket.off('initialMessages', handleInitialMessages);
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [socket, isConnected, caseId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !caseId || !activeAgent) return;

    const newMessage: Message = {
      sender: 'customer',
      text: message,
      timestamp: new Date(),
    };

    socket.emit('sendMessage', {
      ...newMessage,
      caseId,
      recipient: activeAgent._id,
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  const formatTime = (date: Date) => format(date, 'h:mm a');
  const formatMessageDate = (date: Date) => format(date, 'MMMM d, yyyy');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Agent List */}
      <div className="w-1/3 flex flex-col border-r border-gray-300 bg-white">
        {/* Search Bar */}
        <div className="p-3 bg-gray-50">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full py-2 pl-10 pr-4 bg-white rounded-lg focus:outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Case Info */}
        {caseDetails && (
          <div className="p-3 border-b border-gray-200">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-medium text-blue-800">{caseDetails.department} Support</h3>
              <p className="text-sm text-gray-700 mt-1 truncate">{caseDetails.issue}</p>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span
                  className={`px-2 py-1 rounded-full ${
                    caseDetails.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {caseDetails.status}
                </span>
                <span className="text-gray-500">
                  Created: {format(new Date(caseDetails.createdAt), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto">
          {filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <FiMessageSquare className="h-10 w-10 mb-2" />
              <p>No agents available</p>
            </div>
          ) : (
            filteredAgents.map(agent => (
              <div
                key={agent._id}
                onClick={() => setActiveAgent(agent)}
                className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  activeAgent?._id === agent._id ? 'bg-blue-50' : ''
                }`}>
                <User
                  name={agent.fullname}
                  size="40"
                  className="mr-3 rounded-full"
                  color={agent.isActive ? '#3b82f6' : '#9ca3af'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">{agent.fullname}</h3>
                    <span className="text-xs text-gray-500">
                      {agent.isActive ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{agent.department} Department</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeAgent ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-3 border-b border-gray-300 bg-gray-50">
              <User
                name={activeAgent.fullname}
                size="40"
                className="mr-3 rounded-full"
                color={activeAgent.isActive ? '#3b82f6' : '#9ca3af'}
              />
              <div className="flex-1">
                <h3 className="font-medium">{activeAgent.fullname}</h3>
                <p className="text-xs text-gray-500">
                  {activeAgent.department} • {activeAgent.isActive ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FiMessageSquare className="h-10 w-10 mb-2" />
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start the conversation with {activeAgent.fullname}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, index) => {
                    const showDateHeader =
                      index === 0 ||
                      formatMessageDate(new Date(messages[index - 1].timestamp)) !==
                        formatMessageDate(new Date(msg.timestamp));

                    return (
                      <React.Fragment key={index}>
                        {showDateHeader && (
                          <div className="flex justify-center my-2">
                            <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {formatMessageDate(new Date(msg.timestamp))}
                            </div>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                          }`}>
                          <div
                            className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                              msg.sender === 'customer'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow'
                            }`}>
                            <div className="text-sm">{msg.text}</div>
                            <div
                              className={`text-xs mt-1 text-right ${
                                msg.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                              {formatTime(new Date(msg.timestamp))}
                              {msg.sender !== 'customer' && !msg.read && (
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
              <form
                onSubmit={e => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center">
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
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
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
            <h3 className="text-lg font-medium">No agent selected</h3>
            <p className="text-sm">Select an agent from the sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithAgent;
