import {Provider as SocketContextProvider} from "@/socket/context";

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = ({children}) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};

export default SocketProvider;
