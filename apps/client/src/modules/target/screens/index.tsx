"use client";

import type {Message} from "@twincy/types";

import {useEffect, useState} from "react";
import {Flex, Text} from "@chakra-ui/react";
import Confetti from "react-confetti";

import {useSocket} from "@/socket/context";

interface Coordinates {
  top: number;
  left: number;
}

function getRandomCoordinates(): Coordinates {
  const top = Math.floor(Math.random() * 100);
  const left = Math.floor(Math.random() * 100);

  return {
    top,
    left,
  };
}

const TargetScreen = () => {
  const socket = useSocket();
  const [target, setTarget] = useState<Coordinates>(() => getRandomCoordinates());
  const [isPlaying, togglePlaying] = useState<boolean>(false);
  const [isShowing, toggleShowing] = useState<boolean>(false);

  useEffect(() => {
    function handleMesage(event: Message) {
      if (!isShowing && !isPlaying && event.message.toLowerCase().includes("target")) {
        setTarget(getRandomCoordinates());
        togglePlaying(true);
        toggleShowing(true);
      } else if (isShowing && isPlaying && event.message === `${target.top} ${target.left}`) {
        togglePlaying(false);
      }
    }

    socket.on("message", handleMesage);

    return () => {
      socket.off("message", handleMesage);
    };
  }, [socket, target, isPlaying, isShowing]);

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
      color="black"
      flexDirection="column"
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      {isPlaying ? (
        <Text
          backgroundColor="white"
          borderRadius={9999}
          color="black"
          fontSize="4xl"
          height={12}
          left={`${target.left}%`}
          position="absolute"
          top={`${target.top}%`}
          width={12}
        >
          {target.top} - {target.left}
        </Text>
      ) : (
        <Confetti />
      )}
    </Flex>
  );
};

export default TargetScreen;
