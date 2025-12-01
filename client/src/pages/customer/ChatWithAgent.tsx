import { useEffect, useRef, useState } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
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

export default function ChatWithAgent() {
  const { currentCaseId } = useCustomerStore();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  // Typing indicator state
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !isConnected || !currentCaseId) return;

    socket.emit("joinCase", currentCaseId);

    const handleInitialMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setIsOtherUserTyping(false);
    };

    const handleUserTyping = ({ fullname, isTyping }: { fullname: string; isTyping: boolean }) => {
      setIsOtherUserTyping(isTyping);
      setTypingUser(fullname);

      if (isTyping) {
        setTimeout(() => {
          setIsOtherUserTyping(false);
        }, 5000);
      }
    };

    socket.on("initialMessages", handleInitialMessages);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("initialMessages", handleInitialMessages);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userTyping", handleUserTyping);
      socket.emit("leaveCase", currentCaseId);
    };
  }, [socket, isConnected, currentCaseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!socket || !currentCaseId) return;

    socket.emit("typing", { caseId: currentCaseId, isTyping: value.length > 0 });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { caseId: currentCaseId, isTyping: false });
      }, 2000);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !currentCaseId) return;

    socket.emit("typing", { caseId: currentCaseId, isTyping: false });

    socket.emit("sendMessage", {
      caseId: currentCaseId,
      text: input.trim(),
    });

    setInput("");
    setShowEmoji(false);
  };

  if (!currentCaseId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">No Active Support Case</h2>
          <p className="text-gray-500 mt-2">Create a support ticket to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white shadow-sm border-b">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">Support Agent</span>
          <span className="text-xs text-gray-500">{isConnected ? "Online" : "Offline"}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">Start the conversation…</div>
        )}

        {messages.map((msg) => {
          const mine = msg.senderRole === "customer";
          return (
            <div
              key={msg._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2 text-sm shadow-sm whitespace-pre-wrap ${
                  mine
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 ${mine ? "text-blue-100" : "text-gray-400"}`}>
                  {format(new Date(msg.timestamp), "h:mm a")}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isOtherUserTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-sm bg-white border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{typingUser} is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t bg-white relative">
        {showEmoji && (
          <div className="absolute bottom-16 left-3 z-20 bg-white rounded-xl shadow-xl">
            <EmojiPicker
              onEmojiClick={(e) => setInput((i) => i + e.emoji)}
              width={300}
              height={350}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 text-gray-500 hover:text-blue-600"
          >
            <FiSmile size={22} />
          </button>

          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message…"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 rounded-full bg-blue-600 text-white shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
