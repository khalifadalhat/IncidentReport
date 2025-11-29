import { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiSmile,
  FiMessageSquare,
  FiUser,
  FiClock,
} from "react-icons/fi";
import { format } from "date-fns";
import { useSocket } from "@/context/SocketContext";
import EmojiPicker from "emoji-picker-react";
import { useCustomerStore } from "@/store/useCustomerStore";
import Cookie from "js-cookie";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userData = Cookie.get("userData");
  const user = userData ? JSON.parse(userData) : null;
  const currentUserId = user?.sub;

  useEffect(() => {
    if (!socket || !isConnected || !currentCaseId) return;

    socket.emit("joinCase", currentCaseId);

    const handleInitialMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    const handleReceiveMessage = (msg: Message) => {
      console.log("Received message:", msg);
      console.log("Sender:", msg.sender);
      console.log("Current User:", currentUserId);
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
          <FiMessageSquare className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Active Case
          </h2>
          <p className="text-gray-600 mb-6">
            Please create a support request first to start chatting
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-black text-white">
          <h2 className="text-xl font-bold">Your Support Case</h2>
          <p className="text-sm opacity-90">Live chat with agent</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiUser className="text-black" />
                Your Case
              </h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              You are connected to a support agent
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">Support</span>
              <span className="flex items-center gap-1">
                <FiClock />
                {format(new Date(), "MMM d, h:mm a")}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-600">
              Our support team is here to help you. Describe your issue in
              detail for better assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h2 className="text-lg font-semibold">Support Agent</h2>
                <p className="text-sm text-gray-600">Online • Ready to help</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                Case #{currentCaseId.slice(-6)}
              </p>
              <div className="flex items-center gap-2 justify-end mt-1">
                <span className="text-xs text-gray-500">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Status:</strong> Connected to support team
            </p>
            <div className="flex gap-3 mt-2 text-xs text-gray-600">
              <span>💬 Live chat support</span>
              <span>⏱️ Real-time responses</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <FiMessageSquare className="mx-auto text-6xl mb-4 opacity-30" />
              <p>No messages yet. Start the conversation!</p>
              <p className="text-sm mt-2">The agent will join shortly...</p>
            </div>
          ) : (
            messages.map((msg) => {
              // For customer chat, align based on who sent the message
              const isMyMessage = msg.senderRole === "customer";
              
              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-sm ${
                      isMyMessage
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {format(new Date(msg.timestamp), "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4 shadow-lg relative">
          <div className="flex items-center gap-3 max-w-5xl mx-auto">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-gray-500 hover:text-blue-600 transition"
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
              className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !isConnected}
              className="bg-black text-white p-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
            >
              <FiSend className="text-lg" />
            </button>
          </div>
          {showEmoji && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
              <EmojiPicker onEmojiClick={(e) => setInput((i) => i + e.emoji)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWithAgent;