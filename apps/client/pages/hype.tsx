import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import HypeScreen from "~/modules/hype/screens/index";

interface Props {
  socket: Socket;
}

const HypePage: NextPage<Props> = ({socket}) => {
  return <HypeScreen socket={socket} />;
};

export default HypePage;
