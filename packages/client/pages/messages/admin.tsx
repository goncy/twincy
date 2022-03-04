import type {Socket} from "socket.io-client";
import type {NextPage} from "next";

import DashboardScreen from "@/messages/screens/admin/Dashboard";

interface Props {
  socket: Socket;
}

const AdminPage: NextPage<Props> = ({socket}) => {
  return <DashboardScreen socket={socket} />;
};

export default AdminPage;
