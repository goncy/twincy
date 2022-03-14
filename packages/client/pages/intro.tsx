import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import IntroScreen from "@/intro/screens/index";

interface Props {
  socket: Socket;
}

const IntroPage: NextPage<Props> = ({socket}) => {
  return <IntroScreen socket={socket} />;
};

export default IntroPage;
