import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import {useEffect, useState} from "react";
import {Flex, Image, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";

import {EventMessage} from "~/types";

interface Props {
  socket: Socket;
}

interface Pokemon {
  id: number;
  name: string;
}

const POKEMON = [
  "bulbasaur",
  "ivysaur",
  "venusaur",
  "charmander",
  "charmeleon",
  "charizard",
  "squirtle",
  "wartortle",
  "blastoise",
  "caterpie",
  "metapod",
  "butterfree",
  "weedle",
  "kakuna",
  "beedrill",
  "pidgey",
  "pidgeotto",
  "pidgeot",
  "rattata",
  "raticate",
  "spearow",
  "fearow",
  "ekans",
  "arbok",
  "pikachu",
  "raichu",
  "sandshrew",
  "sandslash",
  "nidoran♀",
  "nidorina",
  "nidoqueen",
  "nidoran♂",
  "nidorino",
  "nidoking",
  "clefairy",
  "clefable",
  "vulpix",
  "ninetales",
  "jigglypuff",
  "wigglytuff",
  "zubat",
  "golbat",
  "oddish",
  "gloom",
  "vileplume",
  "paras",
  "parasect",
  "venonat",
  "venomoth",
  "diglett",
  "dugtrio",
  "meowth",
  "persian",
  "psyduck",
  "golduck",
  "mankey",
  "primeape",
  "growlithe",
  "arcanine",
  "poliwag",
  "poliwhirl",
  "poliwrath",
  "abra",
  "kadabra",
  "alakazam",
  "machop",
  "machoke",
  "machamp",
  "bellsprout",
  "weepinbell",
  "victreebel",
  "tentacool",
  "tentacruel",
  "geodude",
  "graveler",
  "golem",
  "ponyta",
  "rapidash",
  "slowpoke",
  "slowbro",
  "magnemite",
  "magneton",
  "farfetch’d",
  "doduo",
  "dodrio",
  "seel",
  "dewgong",
  "grimer",
  "muk",
  "shellder",
  "cloyster",
  "gastly",
  "haunter",
  "gengar",
  "onix",
  "drowzee",
  "hypno",
  "krabby",
  "kingler",
  "voltorb",
  "electrode",
  "exeggcute",
  "exeggutor",
  "cubone",
  "marowak",
  "hitmonlee",
  "hitmonchan",
  "lickitung",
  "koffing",
  "weezing",
  "rhyhorn",
  "rhydon",
  "chansey",
  "tangela",
  "kangaskhan",
  "horsea",
  "seadra",
  "goldeen",
  "seaking",
  "staryu",
  "starmie",
  "mr. mime",
  "scyther",
  "jynx",
  "electabuzz",
  "magmar",
  "pinsir",
  "tauros",
  "magikarp",
  "gyarados",
  "lapras",
  "ditto",
  "eevee",
  "vaporeon",
  "jolteon",
  "flareon",
  "porygon",
  "omanyte",
  "omastar",
  "kabuto",
  "kabutops",
  "aerodactyl",
  "snorlax",
  "articuno",
  "zapdos",
  "moltres",
  "dratini",
  "dragonair",
  "dragonite",
  "mewtwo",
  "mew",
];

function getRandomPokemon(): Pokemon {
  const pokemonId = Math.floor(Math.random() * POKEMON.length);

  return {
    id: pokemonId + 1,
    name: POKEMON[pokemonId],
  };
}

function cleanString(str: string): string {
  return str.replace(/\W/g, "").toLowerCase();
}

const PokemonScreen: NextPage<Props> = ({socket}) => {
  const {
    query: {id},
  } = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon>(() => getRandomPokemon());
  const [isPlaying, togglePlaying] = useState<boolean>(false);
  const [isShowing, toggleShowing] = useState<boolean>(false);

  useEffect(() => {
    function handleMesage(event: EventMessage) {
      if (
        !isShowing &&
        !isPlaying &&
        event.tags["custom-reward-id"] === id &&
        event.message.toLowerCase().includes("pokemon")
      ) {
        setPokemon(getRandomPokemon());
        togglePlaying(true);
        toggleShowing(true);
      } else if (
        isShowing &&
        isPlaying &&
        cleanString(event.message) === cleanString(pokemon.name)
      ) {
        togglePlaying(false);
      }
    }

    socket.on("message", handleMesage);

    return () => {
      socket.off("message", handleMesage);
    };
  }, [socket, pokemon.name, isPlaying, isShowing, id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let hide: NodeJS.Timeout;

    if (isShowing && isPlaying) {
      timeout = setTimeout(() => {
        togglePlaying(false);
      }, 30000);
    } else if (isShowing && !isPlaying) {
      hide = setTimeout(() => {
        toggleShowing(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(hide);
    };
  }, [isPlaying, isShowing]);

  if (!isShowing) return null;

  return (
    <Flex
      alignItems="center"
      backgroundColor="white"
      color="black"
      flexDirection="column"
      fontFamily="'Press Start 2P'"
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      <Image
        alt="Pokemon"
        height={512}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        style={{filter: `brightness(${isPlaying ? 0 : 1})`, imageRendering: "pixelated"}}
        width={512}
      />
      {!isPlaying && <Text fontSize="4xl">{pokemon.name}</Text>}
    </Flex>
  );
};

export default PokemonScreen;
