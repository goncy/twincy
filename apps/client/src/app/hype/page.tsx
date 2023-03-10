import HypeScreen from "@/hype/screens";
import {Provider as SocketProvider} from "@/socket/context";

const HypePage = () => {
  return (
    <SocketProvider>
      <HypeScreen />
    </SocketProvider>
  );
};

export default HypePage;
