import type {NextPage} from "next";

import {ChakraProvider} from "@chakra-ui/react";
import SocketIO from "socket.io-client";

import ShowcaseScreen from "@/messages/screens/showcase";
import theme from "@/messages/screens/showcase/theme";

const socket = SocketIO("http://localhost:6600");

const AdminPage: NextPage = () => {
  return <ShowcaseScreen socket={socket} />;
};

const ShowcasePageContainer: React.VFC = () => {
  return (
    <ChakraProvider theme={theme}>
      <AdminPage />
    </ChakraProvider>
  );
};

export default ShowcasePageContainer;
