import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import { ICase, IMessage } from '../../Types/Icase';
import { useSocket } from '../../context/SocketContext';
import { format } from 'date-fns';
import { useChatStore } from '../../store/chat/useChatStore';
import { useChatCases } from '../../hook/chat/useChat';
import EmojiPicker from '../../ui/EmojiPicker';

const AgentChat: React.FC = () => {
  const {
    messages,
    activeCase,
    cases,
    loading,
    error,
    setMessages,
    addMessage,
    setActiveCase,
    // setLoading,
    setError,
  } = useChatStore();

  const { refetch } = useChatCases();
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isCasesDropdownOpen, setIsCasesDropdownOpen] = useState(false);

  // Initialize socket listeners
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
    };

    socket.on('initialMessages', handleInitialMessages);
    socket.on('receiveMessage', handleNewMessage);
    socket.on('error', (error: string) => {
      setError(error);
    });

    return () => {
      socket.off('initialMessages', handleInitialMessages);
      socket.off('receiveMessage', handleNewMessage);
      socket.off('error');
    };
  }, [socket, isConnected, setMessages, addMessage, setError]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join case room when active case changes
  useEffect(() => {
    if (activeCase && socket && isConnected) {
      socket.emit('joinCase', activeCase._id);
    }
  }, [activeCase, socket, isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeCase || !message.trim() || !socket || !isConnected) return;

    const newMessage: IMessage = {
      sender: 'agent',
      text: message,
      recipient: activeCase.customerName,
      caseId: activeCase._id,
      timestamp: new Date(),
    };

    socket?.emit('sendMessage', newMessage);
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleSelectCase = (caseItem: ICase) => {
    setActiveCase(caseItem);
    setIsCasesDropdownOpen(false);
    setError(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const formatMessageDate = (date: Date) => {
    return format(date, 'MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !activeCase) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center">
        <div className="text-center py-8">
          <FiMessageSquare className="mx-auto h-12 w-12 text-blue-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Chat System</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Customer Chat</h2>
          <div className="relative">
            <button
              onClick={() => setIsCasesDropdownOpen(!isCasesDropdownOpen)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
              <span>{activeCase ? activeCase.customerName : 'Select Case'}</span>
              <FiChevronDown
                className={`transition-transform ${isCasesDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCasesDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                {cases.map(caseItem => (
                  <button
                    key={caseItem._id}
                    onClick={() => handleSelectCase(caseItem)}
                    className={`block w-full text-left px-4 py-2 hover:bg-blue-50 ${
                      activeCase?._id === caseItem._id ? 'bg-blue-100' : ''
                    }`}>
                    <div className="font-medium text-gray-900">{caseItem.customerName}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {caseItem.issue.substring(0, 40)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {activeCase && (
          <div className="mt-2 text-sm text-blue-100">
            Case: {activeCase.issue.substring(0, 50)}...
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {!activeCase ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FiMessageSquare className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No case selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please select a case from the dropdown to start chatting
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FiMessageSquare className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start the conversation with {activeCase.customerName}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              // Group messages by date
              const showDateHeader =
                index === 0 ||
                formatMessageDate(new Date(messages[index - 1].timestamp || 0)) !==
                  formatMessageDate(new Date(msg.timestamp || 0));

              return (
                <React.Fragment key={index}>
                  {showDateHeader && (
                    <div className="flex justify-center">
                      <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {formatMessageDate(new Date(msg.timestamp || 0))}
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${
                        msg.sender === 'agent'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                      }`}>
                      {msg.sender !== 'agent' && (
                        <div className="font-medium text-sm text-blue-600">
                          {activeCase.customerName}
                        </div>
                      )}
                      <div className="text-sm">{msg.text}</div>
                      <div
                        className={`text-xs mt-1 text-right ${
                          msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {formatTime(new Date(msg.timestamp || 0))}
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

      {/* Message input */}
      {activeCase && (
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="relative flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message..."
                  onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-10 top-3 text-gray-500 hover:text-blue-600">
                  <FiSmile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-blue-600">
                  <FiPaperclip className="h-5 w-5" />
                </button>
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-14 right-0 z-10">
                  <EmojiPicker onSelect={handleEmojiSelect} />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <FiSend className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AgentChat;
