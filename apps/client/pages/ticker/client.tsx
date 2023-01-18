import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import TickerClientScreen from "@/ticker/screens/client";

interface Props {
  socket: Socket;
}

const TickerClientPage: NextPage<Props> = ({socket}) => {
  return <TickerClientScreen socket={socket} />;
};

export default TickerClientPage;
