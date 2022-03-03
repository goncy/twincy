import {useState, useEffect} from "react";
import {ChakraProvider} from "@chakra-ui/react";
import SocketIO from "socket.io-client";

import theme from "@/messages/screens/admin/theme";
import DashboardScreen from "@/messages/screens/admin/Dashboard";
import SetupScreen from "@/messages/screens/admin/Setup";

const socket = SocketIO("http://localhost:6600");

const AdminPage: React.VFC = () => {
  const [channel, setChannel] = useState<string | null>(null);

  useEffect(() => {
    socket.on("channel", (channel: string) => setChannel(channel));

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!channel) return <SetupScreen socket={socket} />;

  return <DashboardScreen socket={socket} />;
};

const AdminPageContainer: React.VFC = () => {
  return (
    <ChakraProvider theme={theme}>
      <AdminPage />
    </ChakraProvider>
  );
};

export default AdminPageContainer;
