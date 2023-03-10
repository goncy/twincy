"use client";

import SocketIO, {type Socket} from "socket.io-client";
import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

interface Context {
  state: {
    socket: Socket;
  };
}

interface Props {
  children: React.ReactNode;
}

const SocketContext = React.createContext({} as Context);

function SocketProvider({children}: Props) {
  const searchParams = useSearchParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const channel = searchParams!.get("channel") as string;

  useEffect(() => {
    function handleConnect() {
      setSocket(socket);
    }

    // Create the socket
    const socket = SocketIO(process.env.NEXT_PUBLIC_WS_SERVER!, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 100,
      query: {channel},
    });

    // Add connection handler
    socket.on("connect", handleConnect);

    // Connect to the server
    socket.connect();

    return () => {
      // Remove connection handler
      socket.off("connect", handleConnect);

      // Disconnect from server
      socket.disconnect();

      // Reset socket
      setSocket(null);
    };
  }, [channel]);

  // If not connected return null
  if (!socket) return null;

  // Create state
  const state = {socket};

  return <SocketContext.Provider value={{state}}>{children}</SocketContext.Provider>;
}

function useSocket() {
  const {
    state: {socket},
  } = React.useContext(SocketContext);

  return socket;
}

export {SocketContext as default, SocketProvider as Provider, useSocket};
