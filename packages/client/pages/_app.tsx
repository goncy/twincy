import type {AppProps} from "next/app";

import {ChakraProvider} from "@chakra-ui/react";
import {useEffect} from "react";
import SocketIO from "socket.io-client";

import theme from "~/theme";

const socket = SocketIO("http://localhost:6600");

const App: React.VFC<AppProps> = ({Component, pageProps}) => {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Component socket={socket} {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
