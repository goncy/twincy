import TickerAdminScreen from "@/ticker/screens/admin";
import {Provider as SocketProvider} from "@/socket/context";

const TickerAdminPage = () => {
  return (
    <SocketProvider>
      <TickerAdminScreen />
    </SocketProvider>
  );
};

export default TickerAdminPage;
