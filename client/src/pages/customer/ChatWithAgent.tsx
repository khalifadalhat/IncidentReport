import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../../api';

const socket = io(api.defaults.baseURL ?? '', {
  withCredentials: true,
});

const ChatWithAgent: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('initialMessages', (initialMessages: { sender: string; text: string }[]) => {
      setMessages(initialMessages);
    });

    socket.on('receiveMessage', (message: { sender: string; text: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) {
      alert('Please enter a message.');
      return;
    }

    const newMessage = { sender: 'customer', text };
    socket.emit('sendMessage', newMessage);
    setText('');
  };

  return (
    <div className="bg-white">
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">Chat</h2>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <div className="px-6 py-2 mx-auto md:h-screen w-[50vw] lg:py-0">
      <div className="bg-gray-200 p-4 mb-4 rounded" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'customer' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded ${message.sender === 'customer' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form>
        <label htmlFor="chat" className="sr-only">Your message</label>
        <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
          </button>
          <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
          </button>
          <input
            id="chat"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
          />
          <button type="button" onClick={sendMessage} className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ChatWithAgent;
