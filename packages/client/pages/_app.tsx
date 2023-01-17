import type {AppProps} from "next/app";

import {ChakraProvider} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import SocketIO, {type Socket} from "socket.io-client";
import {useRouter} from "next/router";

import theme from "~/theme";

const App: React.FC<AppProps> = ({Component, pageProps}) => {
  const {
    query: {channel},
  } = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    function handleConnect() {
      setSocket(socket);
    }

    // Create the socket
    const socket = SocketIO(`${window.location.hostname}:6600`, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 100,
      query: {channel},
    });

    // Connect to the server
    socket.connect();

    // Add connection handler
    socket.on("connect", handleConnect);

    return () => {
      // Remove connection handler
      socket.off("connect", handleConnect);

      // Reset handshake query and disconnect from server
      socket.io.opts.query = {};
      socket.disconnect();

      // Reset socket
      setSocket(null);
    };
  }, [channel]);

  // If not connected return null
  if (!socket) return null;

  return (
    <ChakraProvider theme={theme}>
      <Component socket={socket} {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
