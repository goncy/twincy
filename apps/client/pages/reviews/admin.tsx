import type {Socket} from "socket.io-client";
import type {NextPage} from "next";

import AdminScreen from "@/reviews/screens/admin/index";

interface Props {
  socket: Socket;
}

const AdminPage: NextPage<Props> = ({socket}) => {
  return <AdminScreen socket={socket} />;
};

export default AdminPage;
