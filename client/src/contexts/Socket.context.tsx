import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { contextsProviderProps } from "../types/types";

interface SocketContextValue {
  socket: any;
}

const emptySocketContextValue: SocketContextValue = {
  socket: null,
};

const SocketContext = React.createContext<SocketContextValue>(
  emptySocketContextValue
);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, children }: contextsProviderProps) {
  const [socket, setSocket] = useState<any>(null);

  useEffect((): any => {
    if (id) {
      const URL =
        process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000";
      const newSocket = io(URL, { query: { id } });
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [id]);

  const value: SocketContextValue = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
