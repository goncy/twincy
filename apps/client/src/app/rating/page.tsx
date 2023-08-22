import RatingScreen from "@/rating/screens/index";
import {Provider as SocketProvider} from "@/socket/context";

const RatingPage = () => {
  return (
    <SocketProvider>
      <RatingScreen />
    </SocketProvider>
  );
};

export default RatingPage;
