import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookie from "js-cookie";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let token = Cookie.get("token");

    if (!token) {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      }
    }

    if (!token) {
      console.error("❌ No token found for socket connection");
      return;
    }

    let SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    SOCKET_URL = SOCKET_URL.replace(/\/api\/?$/, "");

    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("Error details:", error);
      setIsConnected(false);
    });

    newSocket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
