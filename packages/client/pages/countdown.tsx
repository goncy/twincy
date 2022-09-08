import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import {useRouter} from "next/router";

import CountdownScreen from "@/countdown/screens/index";

interface Props {
  socket: Socket;
}

const CountdownPage: NextPage<Props> = () => {
  const {query} = useRouter();

  return (
    <CountdownScreen
      text={(query.text as string) || "Arrancamos en"}
      timer={Number(query.timer || 600)}
    />
  );
};

export default CountdownPage;
