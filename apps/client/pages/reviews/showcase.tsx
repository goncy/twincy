import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import ReviewScreen from "@/reviews/screens/showcase/index";

interface Props {
  socket: Socket;
}

const ReviewPage: NextPage<Props> = ({socket}) => {
  return <ReviewScreen socket={socket} />;
};

export default ReviewPage;
