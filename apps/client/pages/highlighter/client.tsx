import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import HighlighterClientScreen from "@/highlighter/screens/client";

interface Props {
  socket: Socket;
}

const HighlighterClientPage: NextPage<Props> = ({socket}) => {
  return <HighlighterClientScreen socket={socket} />;
};

export default HighlighterClientPage;
