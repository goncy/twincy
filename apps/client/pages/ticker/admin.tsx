import type {Socket} from "socket.io-client";
import type {NextPage} from "next";

import TickerAdminScreen from "@/ticker/screens/admin";

interface Props {
  socket: Socket;
}

const TickerAdminPage: NextPage<Props> = ({socket}) => {
  return <TickerAdminScreen socket={socket} />;
};

export default TickerAdminPage;
