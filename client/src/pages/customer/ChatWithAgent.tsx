import { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiSmile,
  FiMessageSquare,
  FiUser,
  FiClock,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { format } from "date-fns";
import { useSocket } from "@/context/SocketContext";
import EmojiPicker from "emoji-picker-react";
import { useCustomerStore } from "@/store/useCustomerStore";

interface Message {
  _id: string;
  text: string;
  senderRole: "customer" | "agent";
  sender: string;
  timestamp: string;
}

const ChatWithAgent = () => {
  const { currentCaseId } = useCustomerStore();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !isConnected || !currentCaseId) return;

    socket.emit("joinCase", currentCaseId);

    const handleInitialMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("initialMessages", handleInitialMessages);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("initialMessages", handleInitialMessages);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.emit("leaveCase", currentCaseId);
    };
  }, [socket, isConnected, currentCaseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !currentCaseId) return;

    const messageData = {
      caseId: currentCaseId,
      text: input.trim(),
    };

    socket.emit("sendMessage", messageData);
    setInput("");
    setShowEmoji(false);
  };

  if (!currentCaseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiMessageSquare className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Active Case
          </h2>
          <p className="text-gray-600 mb-6">
            Please create a support request first to start chatting with our
            agents
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition"
          >
            {isSidebarOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMenu className="text-xl" />
            )}
          </button>
          <div>
            <h1 className="font-bold text-lg">Support Chat</h1>
            <p className="text-sm opacity-90">
              Case #{currentCaseId.slice(-6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <span className="text-sm">{isConnected ? "Live" : "Offline"}</span>
        </div>
      </div>

      {/* Sidebar - Mobile Overlay & Desktop Fixed */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r flex flex-col transform transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Your Support Case</h2>
              <p className="text-sm opacity-90">Live chat with agent</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-blue-700 rounded-lg"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <FiUser className="text-white text-sm" />
                </div>
                Your Case
              </h3>
              <span className="text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You are connected to a support agent who will help resolve your
              issue.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <span className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-full">
                Support Ticket
              </span>
              <span className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full">
                <FiClock className="text-blue-600" />
                {format(new Date(), "MMM d, h:mm a")}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-sm">
                ?
              </span>
              Need Help?
            </h4>
            <p className="text-sm text-blue-700">
              Our support team is here to help you. Describe your issue in
              detail for faster and better assistance.
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
                Be specific about your issue
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"></div>
                Share relevant details
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header - Desktop */}
        <div className="hidden lg:block bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Support Agent</h2>
                <p className="opacity-90">Online • Ready to help you now</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">
                Case #{currentCaseId.slice(-6)}
              </p>
              <div className="flex items-center gap-3 justify-end mt-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  <span className="text-sm">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-gradient-to-b from-white to-blue-50/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mb-6">
                <FiMessageSquare className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Start Your Conversation
              </h3>
              <p className="text-gray-600 max-w-md">
                No messages yet. Start chatting with our support agent. They'll
                help you resolve your issue quickly.
              </p>
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Describe your issue clearly for
                  faster assistance
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isMyMessage = msg.senderRole === "customer";

                return (
                  <div
                    key={msg._id}
                    className={`flex ${
                      isMyMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-sm ${
                        isMyMessage
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="break-words text-sm lg:text-base">
                        {msg.text}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          isMyMessage ? "opacity-80" : "text-gray-500"
                        }`}
                      >
                        {format(new Date(msg.timestamp), "h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4 shadow-lg relative">
          {showEmoji && (
            <div className="absolute bottom-20 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-md z-10">
              <div className="bg-white rounded-xl shadow-2xl border">
                <EmojiPicker
                  onEmojiClick={(e) => setInput((i) => i + e.emoji)}
                  width="100%"
                  height={350}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-gray-500 hover:text-blue-600 transition p-3 rounded-full hover:bg-blue-50"
            >
              <FiSmile className="text-2xl" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Type your message to the support agent..."
              className="flex-1 px-5 py-3 lg:py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !isConnected}
              className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                !input.trim() || !isConnected
                  ? ""
                  : "hover:shadow-lg transform hover:scale-105 active:scale-95"
              }`}
            >
              <FiSend className="text-lg" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500 px-4">
            <div className="flex items-center gap-4">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAgent;
