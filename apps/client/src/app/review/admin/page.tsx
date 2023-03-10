import ReviewAdminScreen from "@/review/screens/admin";
import {Provider as SocketProvider} from "@/socket/context";

interface Props {
  searchParams: {
    command: string;
  };
}

const ReviewAdminPage = ({searchParams: {command = "review"}}: Props) => {
  return (
    <SocketProvider>
      <ReviewAdminScreen command={command} />
    </SocketProvider>
  );
};

export default ReviewAdminPage;
