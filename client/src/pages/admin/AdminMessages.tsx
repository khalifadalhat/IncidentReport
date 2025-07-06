import React from 'react';
import io from 'socket.io-client';
import api from '../../utils/api';

const socket = io(api.defaults.baseURL ?? '', {
  withCredentials: true,
});

const AdminMessages: React.FC = () => {
  const sendMessage = (message: { sender: string, text: string }) => {
    socket.emit('sendMessage', message);
  };

  const handleCustomer = () => {
    sendMessage({ sender: 'admin', text: 'Message to customer' });
  };

  const handleInChat = () => {
    sendMessage({ sender: 'admin', text: 'In-chat message' });
  };

  const handleEscalateCases = () => {
    sendMessage({ sender: 'admin', text: 'Escalate case' });
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Messages</h2>
      <div className="space-y-4">
        <button onClick={handleCustomer} className="bg-blue-500 text-white p-2 rounded">Customer</button>
        <button onClick={handleInChat} className="bg-green-500 text-white p-2 rounded">In-Chat</button>
        <button onClick={handleEscalateCases} className="bg-red-500 text-white p-2 rounded">Escalate Cases</button>
      </div>
    </div>
  );
};

export default AdminMessages;
