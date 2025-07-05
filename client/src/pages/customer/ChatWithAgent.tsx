import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import api from '../../api';
import { format } from 'date-fns';
import { FiSend, FiUser, FiMessageSquare, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Message {
  sender: string;
  text: string;
  timestamp: Date;
  _id?: string;
}

interface CaseDetails {
  customerName: string;
  department: string;
  issue: string;
  location: string;
  status: string;
  createdAt: string;
  _id: string;
}

interface Agent {
  _id: string;
  fullname: string;
  department: string;
  isActive: boolean;
}

const ChatWithAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState({
    case: true,
    agents: true,
    messages: true,
  });
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(api.defaults.baseURL ?? '', {
      withCredentials: true,
      transports: ['websocket'],
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch case details
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await api.get('/cases/latest');
        setCaseDetails(response.data);
        setLoading(prev => ({ ...prev, case: false }));
      } catch (err) {
        console.error('Error fetching case details:', err);
        setError('Failed to load case details');
        setLoading(prev => ({ ...prev, case: false }));
      }
    };

    fetchCaseDetails();
  }, []);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/agents/available');
        setAgentList(response.data);
        if (response.data.length > 0) {
          setActiveAgent(response.data[0]._id);
        }
        setLoading(prev => ({ ...prev, agents: false }));
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agent list');
        setLoading(prev => ({ ...prev, agents: false }));
      }
    };

    fetchAgents();
  }, []);

  // Socket.io message handling
  useEffect(() => {
    if (!socket) return;

    const handleInitialMessages = (initialMessages: Message[]) => {
      setMessages(initialMessages);
      setLoading(prev => ({ ...prev, messages: false }));
    };

    const handleReceiveMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleError = (err: Error) => {
      console.error('Socket error:', err);
      setError('Connection error. Trying to reconnect...');
    };

    socket.on('connect', () => {
      setError(null);
      if (caseDetails) {
        socket.emit('joinCase', caseDetails._id);
      }
    });

    socket.on('initialMessages', handleInitialMessages);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('connect_error', handleError);
    socket.on('error', handleError);

    return () => {
      socket.off('initialMessages', handleInitialMessages);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('connect_error', handleError);
      socket.off('error', handleError);
    };
  }, [socket, caseDetails]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !activeAgent || !socket || !caseDetails) return;

    const newMessage: Message = {
      sender: 'customer',
      text,
      timestamp: new Date(),
    };

    try {
      socket.emit('sendMessage', {
        ...newMessage,
        caseId: caseDetails._id,
        recipient: activeAgent,
      });
      setText('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading.case || loading.agents) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Case Details */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <FiMessageSquare className="mr-2 text-blue-600" />
            Support Case
          </h2>
          {caseDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-blue-50 p-4 rounded-lg"
            >
              <h3 className="font-medium text-blue-800">{caseDetails.department}</h3>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <FiClock className="mr-1" />
                {format(new Date(caseDetails.createdAt), 'MMM d, h:mm a')}
              </div>
              <p className="mt-2 text-sm text-gray-700">{caseDetails.issue}</p>
              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    caseDetails.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : caseDetails.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {caseDetails.status}
                </span>
                <span className="text-xs text-gray-500">{caseDetails.location}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Agent List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-medium mb-3 flex items-center">
            <FiUser className="mr-2 text-blue-600" />
            Available Agents
          </h3>
          {agentList.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No agents available at the moment
            </div>
          ) : (
            <div className="space-y-2">
              {agentList.map(agent => (
                <motion.div
                  key={agent._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${
                    activeAgent === agent._id
                      ? 'bg-blue-100 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => setActiveAgent(agent._id)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${
                      agent.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  >
                    {agent.fullname.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{agent.fullname}</p>
                    <p className="text-xs text-gray-500">{agent.department}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center">
          {activeAgent ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                {agentList.find(a => a._id === activeAgent)?.fullname.charAt(0) || 'A'}
              </div>
              <div>
                <h2 className="font-semibold">
                  {agentList.find(a => a._id === activeAgent)?.fullname || 'Agent'}
                </h2>
                <p className="text-xs text-gray-500">
                  {agentList.find(a => a._id === activeAgent)?.department || 'Support'}
                </p>
              </div>
            </>
          ) : (
            <h2 className="font-semibold text-gray-600">
              Please select an agent to chat
            </h2>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {loading.messages ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FiMessageSquare className="text-4xl mb-2" />
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex ${
                  message.sender === 'customer' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'customer'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              disabled={!activeAgent}
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim() || !activeAgent}
              className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg flex items-center ${
                !text.trim() || !activeAgent
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600'
              }`}
            >
              <FiSend className="mr-1" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAgent;