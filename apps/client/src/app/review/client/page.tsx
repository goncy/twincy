import ReviewClientScreen from "@/review/screens/client";
import {Provider as SocketProvider} from "@/socket/context";

interface Props {
  searchParams: {
    command: string;
  };
}

const ReviewClientPage = ({searchParams: {command = "review"}}: Props) => {
  return (
    <SocketProvider>
      <ReviewClientScreen command={command} />
    </SocketProvider>
  );
};

export default ReviewClientPage;
