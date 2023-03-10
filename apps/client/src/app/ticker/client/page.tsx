import TickerClientScreen from "@/ticker/screens/client";
import {Provider as SocketProvider} from "@/socket/context";

const TickerClientPage = () => {
  return (
    <SocketProvider>
      <TickerClientScreen />
    </SocketProvider>
  );
};

export default TickerClientPage;
