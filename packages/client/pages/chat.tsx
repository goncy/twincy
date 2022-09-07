import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import ChatScreen from "~/modules/chat/screens/index";

interface Props {
  socket: Socket;
}

const ChatPage: NextPage<Props> = ({socket}) => {
  return <ChatScreen socket={socket} />;
};

export default ChatPage;
