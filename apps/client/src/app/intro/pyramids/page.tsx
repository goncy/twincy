import {Provider as SocketProvider} from "@/socket/context";
import PyramidsScreen from "@/intro/screens/pyramids";

const IntroPyramidsPage = () => {
  return (
    <SocketProvider>
      <PyramidsScreen />
    </SocketProvider>
  );
};

export default IntroPyramidsPage;
