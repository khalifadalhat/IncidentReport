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
import Cookie from "js-cookie";
import { useAgentCasesStore } from "@/store/agent/useAgentCasesStore";
import { useFetchAgentCases } from "@/hook/agent/useAgentCases";
import { Case } from "@/Types/Icase";

interface Message {
  _id: string;
  text: string;
  senderRole: "customer" | "agent";
  timestamp: string;
}

const AgentChat = () => {
  const { socket, isConnected } = useSocket();

  const userData = Cookie.get("userData");
  const user = userData ? JSON.parse(userData) : null;
  const agentId = user?.sub;

  const { activeCases, loading: casesLoading } = useAgentCasesStore();

  useFetchAgentCases(agentId || "", "active");

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCases.length > 0 && !selectedCase) {
      setSelectedCase(activeCases[0] as unknown as Case);
    }
  }, [activeCases, selectedCase]);

  useEffect(() => {
    if (!socket || !isConnected || !selectedCase) return;

    socket.emit("joinCase", selectedCase._id);

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
    };
  }, [socket, isConnected, selectedCase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !selectedCase) return;

    const messageData = {
      caseId: selectedCase._id,
      text: input.trim(),
    };
    socket.emit("sendMessage", messageData);
    setInput("");
    setShowEmoji(false);
  };

  const handleCaseSelect = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setMessages([]);
  };

  useEffect(() => {
    console.log("Socket status:", { socket, isConnected });
    console.log("Selected case:", selectedCase);
  }, [socket, isConnected, selectedCase]);

  if (casesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  const getDate = (dateStr?: string) => {
    if (!dateStr) return new Date();
    return new Date(dateStr);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-black text-white">
          <h2 className="text-xl font-bold">Active Cases</h2>
          <p className="text-sm opacity-90">
            {activeCases.length} open conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeCases.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FiMessageSquare className="mx-auto text-5xl mb-3 opacity-30" />
              <p>No active cases assigned</p>
            </div>
          ) : (
            activeCases.map((caseItem) => (
              <div
                key={caseItem._id}
                onClick={() => handleCaseSelect(caseItem)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  selectedCase?._id === caseItem._id
                    ? "bg-white border-l-4 border-black"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FiUser className="text-black" />
                    {caseItem.customerName || caseItem.customer?.fullname}
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {caseItem.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {caseItem.issue}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {caseItem.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock />
                    {format(
                      getDate(caseItem.updatedAt || caseItem.createdAt),
                      "MMM d, h:mm a"
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedCase ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center p-10">
              <FiMessageSquare className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Select a case to start chatting
              </h2>
              <p className="text-gray-600">
                Choose a customer from the sidebar to view their conversation
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {(
                      selectedCase.customerName ||
                      selectedCase.customer?.fullname ||
                      "?"
                    ).charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedCase.customerName ||
                        selectedCase.customer?.fullname}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedCase.customer?.email || "No email provided"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    Case #{selectedCase._id.slice(-6)}
                  </p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span className="text-xs text-gray-500">
                      {isConnected ? "Connected" : "Disconnected"}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Issue:</strong> {selectedCase.issue}
                </p>
                <div className="flex gap-3 mt-2 text-xs text-gray-600">
                  <span>📍 {selectedCase.location}</span>
                  <span>🏢 {selectedCase.department}</span>
                </div>
              </div>
            </div>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <FiMessageSquare className="mx-auto text-6xl mb-4 opacity-30" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAgentMessage = msg.senderRole === "agent";

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${
                        isAgentMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-sm ${
                          isAgentMessage
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
            <div className="bg-white border-t p-4 shadow-lg">
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
                  placeholder={`Reply to ${
                    selectedCase.customerName || selectedCase.customer?.fullname
                  }...`}
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
                  <EmojiPicker
                    onEmojiClick={(e) => setInput((i) => i + e.emoji)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentChat;
