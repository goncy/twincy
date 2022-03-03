import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import SocketIO from "socket.io-client";

import ShowcaseScreen from "@/messages/screens/showcase";

const socket = SocketIO("http://localhost:6600");

interface Props {
  socket: Socket;
}

const ShowcasePage: NextPage<Props> = () => {
  return <ShowcaseScreen socket={socket} />;
};

export default ShowcasePage;
