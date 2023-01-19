import ReviewClientScreen from "@/reviews/screens/client";
import {Provider as SocketProvider} from "@/socket/context";

const ReviewClientPage = () => {
  return (
    <SocketProvider>
      <ReviewClientScreen />
    </SocketProvider>
  );
};

export default ReviewClientPage;
