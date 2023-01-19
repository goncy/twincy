import {Provider as SocketProvider} from "@/socket/context";
import PyramidsScreen from "@/intro/screens/pyramids";

const IntroPage = () => {
  return (
    <SocketProvider>
      <PyramidsScreen />
    </SocketProvider>
  );
};

export default IntroPage;
