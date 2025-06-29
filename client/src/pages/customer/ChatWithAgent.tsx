import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from '../../api';
import { format } from 'date-fns';

const socket = io(api.defaults.baseURL ?? '', {
  withCredentials: true,
});

interface Message {
  sender: string;
  text: string;
  timestamp: Date;
}

interface CaseDetails {
  customerName: string;
  department: string;
  issue: string;
  location: string;
  status: string;
  createdAt: string;
}

const ChatWithAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [agentList, setAgentList] = useState<any[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch case details and initial messages
  useEffect(() => {
    // Simulate fetching case details (replace with actual API call)
    const fetchCaseDetails = async () => {
      try {
        // This would come from your navigation state or API
        const response = await api.get('/cases');
        setCaseDetails(response.data);
      } catch (error) {
        console.error('Error fetching case details:', error);
      }
    };

    // Simulate fetching agent list (replace with actual API call)
    const fetchAgents = async () => {
      try {
        const response = await api.get('/agents');
        setAgentList(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchCaseDetails();
    fetchAgents();

    // Socket.io setup
    socket.on('initialMessages', (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    socket.on('receiveMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage: Message = {
      sender: 'customer',
      text,
      timestamp: new Date(),
    };

    socket.emit('sendMessage', newMessage);
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Support Cases</h2>
        </div>

        {/* Case Details */}
        {caseDetails && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium mb-2">Current Case</h3>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium">{caseDetails.department}</p>
              <p className="text-xs text-gray-600 mt-1">
                {format(new Date(caseDetails.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
              <p className="text-sm mt-2">{caseDetails.issue}</p>
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    caseDetails.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : caseDetails.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {caseDetails.status}
                </span>
                <span className="text-xs text-gray-500">{caseDetails.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Agent List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-medium mb-2">Agents</h3>
          <div className="space-y-2">
            {agentList.map(agent => (
              <div
                key={agent._id}
                className={`p-3 rounded-lg cursor-pointer flex items-center ${
                  activeAgent === agent._id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveAgent(agent._id)}>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  {agent.fullname.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{agent.fullname}</p>
                  <p className="text-xs text-gray-500">{agent.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          {activeAgent ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                {agentList.find(a => a._id === activeAgent)?.fullname.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold">
                  {agentList.find(a => a._id === activeAgent)?.fullname}
                </h2>
                <p className="text-xs text-gray-500">
                  {agentList.find(a => a._id === activeAgent)?.department}
                </p>
              </div>
            </>
          ) : (
            <h2 className="font-semibold">Select an agent to chat</h2>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.sender === 'customer' ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'customer'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}>
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                  {format(new Date(message.timestamp), 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
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
              className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${
                !text.trim() || !activeAgent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAgent;
