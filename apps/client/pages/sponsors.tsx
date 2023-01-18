import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import {useRouter} from "next/router";

import SponsorsScreen from "@/sponsor/screens/index";

interface Props {
  socket: Socket;
}

const SponsorsPage: NextPage<Props> = () => {
  const {query} = useRouter();

  return (
    <SponsorsScreen
      duration={Number(query.duration || 1000 * 10)}
      loop={Number(query.loop || 1000 * 60 * 10)}
    />
  );
};

export default SponsorsPage;
