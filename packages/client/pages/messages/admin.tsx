import type {Socket} from "socket.io-client";
import type {NextPage} from "next";

import AdminScreen from "@/messages/screens/admin";

interface Props {
  socket: Socket;
}

const AdminPage: NextPage<Props> = ({socket}) => {
  return <AdminScreen socket={socket} />;
};

export default AdminPage;
