import type {Socket} from "socket.io-client";
import type {NextPage} from "next";

import HighlighterAdminScreen from "@/highlighter/screens/admin";

interface Props {
  socket: Socket;
}

const HighlighterAdminPage: NextPage<Props> = ({socket}) => {
  return <HighlighterAdminScreen socket={socket} />;
};

export default HighlighterAdminPage;
