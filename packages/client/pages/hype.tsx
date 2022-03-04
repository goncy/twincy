import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import {useEffect, useState} from "react";
import {Flex, Image, Text} from "@chakra-ui/react";

import {EventMessage} from "~/types";

interface Props {
  socket: Socket;
}

const HypePage: NextPage<Props> = ({socket}) => {
  const [isPlaying, togglePlaying] = useState<boolean>(false);
  const [isShowing, toggleShowing] = useState<boolean>(false);
  const [count, setCount] = useState(1);

  useEffect(() => {
    function handleMesage(event: EventMessage) {
      if (event.message === "!hype" && !isPlaying) {
        toggleShowing(true);
        togglePlaying(true);

        setTimeout(() => {
          togglePlaying(false);
        }, 30000);

        setTimeout(() => {
          toggleShowing(false);
          setCount(1);
        }, 40000);
      }

      setCount((count) => count + 1);

      setTimeout(() => setCount((count) => count - 1), 5000);
    }

    socket.on("message", handleMesage);

    return () => {
      socket.off("message", handleMesage);
    };
  }, [socket, isPlaying]);

  if (!isShowing) return null;

  return (
    <Flex
      alignItems="center"
      backgroundColor="white"
      color="black"
      flexDirection="column"
      fontFamily="sans-serif"
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      <Image
        alt="Pokemon"
        height={`${32 * count}px`}
        src="https://icongr.am/clarity/heart.svg?size=128&color=000000"
        width={`${32 * count}px`}
      />
      <Text fontSize="3xl" fontWeight="bold" textTransform="uppercase">
        {count} hypes
      </Text>
    </Flex>
  );
};

export default HypePage;
