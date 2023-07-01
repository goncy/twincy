import TargetScreen from "@/target/screens";
import {Provider as SocketProvider} from "@/socket/context";

const TargetPage = () => {
  return (
    <SocketProvider>
      <TargetScreen />
    </SocketProvider>
  );
};

export default TargetPage;
