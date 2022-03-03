import type {Socket} from "socket.io-client";
import type {NextPage} from "next";

import {useState, useEffect} from "react";

import DashboardScreen from "@/messages/screens/admin/Dashboard";
import SetupScreen from "@/messages/screens/admin/Setup";

interface Props {
  socket: Socket;
}

const AdminPage: NextPage<Props> = ({socket}) => {
  const [channel, setChannel] = useState<string | null>(null);

  useEffect(() => {
    socket.on("channel", (channel: string) => setChannel(channel));
  }, [socket]);

  if (!channel) return <SetupScreen socket={socket} />;

  return <DashboardScreen socket={socket} />;
};

export default AdminPage;
