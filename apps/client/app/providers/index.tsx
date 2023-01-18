import ThemeProvider from "./theme";
import SocketProvider from "./socket";

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({children}) => {
  return (
    <ThemeProvider>
      <SocketProvider>{children}</SocketProvider>
    </ThemeProvider>
  );
};

export default Providers;
