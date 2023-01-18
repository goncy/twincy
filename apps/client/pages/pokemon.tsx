import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import PokemonScreen from "~/modules/pokemon/screens/index";

interface Props {
  socket: Socket;
}

const PokemonPage: NextPage<Props> = ({socket}) => {
  return <PokemonScreen socket={socket} />;
};

export default PokemonPage;
