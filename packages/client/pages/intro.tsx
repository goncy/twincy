import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import PyramidsScreen from "@/intro/screens/pyramids";

interface Props {
  socket: Socket;
}

const IntroPage: NextPage<Props> = ({socket}) => {
  return <PyramidsScreen socket={socket} />;
};

export default IntroPage;
