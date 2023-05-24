import VoteScreen from "@/vote/screens/index";
import {Provider as SocketProvider} from "@/socket/context";

const VotePage = () => {
  return (
    <SocketProvider>
      <VoteScreen />
    </SocketProvider>
  );
};

export default VotePage;
