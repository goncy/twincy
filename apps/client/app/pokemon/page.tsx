import PokemonScreen from "@/pokemon/screens";
import {Provider as SocketProvider} from "@/socket/context";

const PokemonPage = () => {
  return (
    <SocketProvider>
      <PokemonScreen />
    </SocketProvider>
  );
};

export default PokemonPage;
