import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});


const getAuthTokenFromStorage = () => {
  try {
    const storageData = localStorage.getItem("auth-storage");
    if (storageData) {
      const parsedData = JSON.parse(storageData);
      return parsedData.state.token; 
    }
  } catch (e) {
    console.error("Error parsing auth-storage:", e);
  }
  return null;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getAuthTokenFromStorage(); 
    
    if (!token) {
      console.warn("Socket connection skipped: JWT token not found in storage.");
      return;
    }

    const newSocket = io(
      import.meta.env.VITE_API_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket"],
        autoConnect: true,
      }
    );

    newSocket.on("connect", () => {
      setIsConnected(true);
    });
    

    newSocket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
        setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from server. Reason:", reason);
      setIsConnected(false);
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