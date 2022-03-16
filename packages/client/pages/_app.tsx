import type {AppProps} from "next/app";

import {ChakraProvider} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import SocketIO from "socket.io-client";
import {useRouter} from "next/router";

import theme from "~/theme";

const socket = SocketIO("http://localhost:6600", {autoConnect: false});

const App: React.VFC<AppProps> = ({Component, pageProps}) => {
  const {
    query: {channel},
  } = useRouter();
  const [isConnected, toggleConnected] = useState<boolean>(false);

  useEffect(() => {
    function handleConnect() {
      toggleConnected(true);
    }

    // Only connect if a channel is present
    if (channel) {
      socket.io.opts.query = {channel};
      socket.connect();
    }

    // Add connection handler
    socket.on("connect", handleConnect);

    return () => {
      // Remove connection handler
      socket.off("connect", handleConnect);

      // Reset handshake query and disconnect from server
      socket.io.opts.query = {};
      socket.disconnect();
    };
  }, [channel]);

  if (!isConnected) return null;

  return (
    <ChakraProvider theme={theme}>
      <Component socket={socket} {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
