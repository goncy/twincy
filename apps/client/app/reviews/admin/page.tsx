import ReviewAdminScreen from "@/reviews/screens/admin";
import {Provider as SocketProvider} from "@/socket/context";

const ReviewAdminPage = () => {
  return (
    <SocketProvider>
      <ReviewAdminScreen />
    </SocketProvider>
  );
};

export default ReviewAdminPage;
