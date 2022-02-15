import * as React from "react";
import SocketIO from "socket.io-client";

import DashboardScreen from "./screens/Dashboard";
import SetupScreen from "./screens/Setup";

const socket = SocketIO(process.env.NODE_ENV === "production" ? "/" : "http://localhost:6600");

const App: React.FC = () => {
  const [channel, setChannel] = React.useState<string | null>(null);

  React.useEffect(() => {
    socket.on("channel", (channel: string) => setChannel(channel));

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!channel) return <SetupScreen socket={socket} />;

  return <DashboardScreen socket={socket} />;
};

export default App;
