import React, { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketProvider {
  children?: React.ReactNode;
}

interface ISocketContext {}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};

export const SocketProvider: React.FC<ISocketProvider> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const _socket = io(`http://localhost:8000`, {
      query: {
        userToken: localStorage.getItem("username"),
      },
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
