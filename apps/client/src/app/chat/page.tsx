import ChatScreen from "@/chat/screens";
import {Provider as SockerProvider} from "@/socket/context";

const ChatPage = () => {
  return (
    <SockerProvider>
      <ChatScreen />
    </SockerProvider>
  );
};

export default ChatPage;
