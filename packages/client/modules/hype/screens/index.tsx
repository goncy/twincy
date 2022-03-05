import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import Confetti from "react-confetti";
import {useEffect, useRef, useState} from "react";
import {Flex, Text} from "@chakra-ui/react";

import {EventMessage} from "~/types";

interface Props {
  socket: Socket;
}

const HypeScreen: NextPage<Props> = ({socket}) => {
  const [isPlaying, togglePlaying] = useState<boolean>(false);
  const [isShowing, toggleShowing] = useState<boolean>(false);
  const [count, setCount] = useState(1);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    function handleMesage(event: EventMessage) {
      if (!isShowing && !isPlaying && event.message === "!hype") {
        timeouts.current = [];
        setCount(1);
        toggleShowing(true);
        togglePlaying(true);
      } else if (isShowing && isPlaying) {
        setCount((count) => count + 1);

        timeouts.current.push(setTimeout(() => setCount((count) => count - 1), 5000));
      }
    }

    socket.on("message", handleMesage);

    return () => {
      socket.off("message", handleMesage);
    };
  }, [socket, isShowing, isPlaying]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let hide: NodeJS.Timeout;

    if (isShowing && isPlaying) {
      timeout = setTimeout(() => {
        togglePlaying(false);

        timeouts.current.forEach(clearTimeout);
      }, 10000);
    } else if (isShowing && !isPlaying) {
      hide = setTimeout(() => {
        toggleShowing(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(hide);
    };
  }, [isShowing, isPlaying]);

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
      <figure className="is-center" style={{fill: `rgb(${5 * count}, 0, 0)`}}>
        <svg
          height={300}
          id="entypo-heart"
          style={{transform: `scale(${1 + 0.05 * count})`, transition: "all 0.25s"}}
          viewBox="0 0 20 20"
          width={300}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="M17.19 4.155c-1.672-1.534-4.383-1.534-6.055 0L10 5.197 8.864 4.155c-1.672-1.534-4.382-1.534-6.054 0-1.881 1.727-1.881 4.52 0 6.246L10 17l7.19-6.599c1.88-1.726 1.88-4.52 0-6.246z" />
          </g>
        </svg>
      </figure>

      {isShowing && !isPlaying && <Confetti />}

      <Text
        color="white"
        fontSize="3xl"
        fontWeight="bold"
        position="absolute"
        textTransform="uppercase"
      >
        {count} hype(s)
      </Text>
    </Flex>
  );
};

export default HypeScreen;
