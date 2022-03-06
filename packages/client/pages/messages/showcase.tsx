import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import ShowcaseScreen from "@/messages/screens/showcase";

interface Props {
  socket: Socket;
}

const ShowcasePage: NextPage<Props> = ({socket}) => {
  return <ShowcaseScreen socket={socket} />;
};

export default ShowcasePage;
