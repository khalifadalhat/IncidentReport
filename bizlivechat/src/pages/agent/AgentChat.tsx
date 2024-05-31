import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ICase } from '../interface/Icase';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd'
  }
});

const AgentChat: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [message, setMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [cases, setCases] = useState<ICase[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cases`);
        setCases(response.data.cases);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    fetchData();

    socket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (!selectedCustomer) {
      alert('Please select a customer to chat with.');
      return;
    }
  
    const newMessage = { sender: 'agent', text: message, recipient: selectedCustomer };
    socket.emit('sendMessage', newMessage);
    setMessage('');
  };
  

  return (
    <div>
      <h2 className="text-2xl mb-4">Chat</h2>
      <div className="bg-gray-200 p-4 mb-4 rounded" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'agent' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded ${msg.sender === 'agent' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mb-2">
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border p-2 flex-1 rounded mr-2"
        >
          <option value="">Select Customer</option>
          {cases.map((caseItem, index) => (
            <option key={index} value={caseItem.customerName}>{caseItem.customerName}</option>
          ))}
        </select>
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded mr-2"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default AgentChat;
