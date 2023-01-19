"use client";

import {FC, useEffect, useState} from "react";
import {Box, Stack, Text, keyframes} from "@chakra-ui/react";

const animation = keyframes`
from {
  background-position: 0px 0px;
  opacity: 0.35;
}

to {
  background-position: 1920px 1080px;
  opacity: 0.4;
}
`;

type TimerProps = {
  seconds: number;
};

const Timer: FC<TimerProps> = ({seconds}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <Text fontFamily="monospace" fontSize="8rem" fontWeight="700">
      {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
      {String(Math.round(timeLeft % 60)).padStart(2, "0")}
    </Text>
  );
};

const GradientScreen: FC = () => {
  return (
    <Stack background="black" color="whiteAlpha.900" height="100%" justifyContent="center">
      <Box
        animation={`${animation} 10s ease-in-out alternate infinite`}
        backgroundBlendMode="screen"
        backgroundRepeat="round"
        bgGradient="radial(primary.500, black, primary.500, black)"
        borderRadius="3xl"
        filter="blur(200px)"
        h="80%"
        position="absolute"
        w="100%"
        zIndex={0}
      />
      <Stack
        alignSelf="flex-end"
        fontFamily="inter"
        lineHeight="1.1"
        padding={12}
        spacing={0}
        textAlign="right"
        zIndex={1}
      >
        <Text
          bgClip="text"
          bgGradient="linear(to-l, primary.300, primary.500)"
          fontSize="9rem"
          fontWeight="700"
        >
          empezamos en
        </Text>
        <Timer seconds={100} />
      </Stack>
    </Stack>
  );
};

export default GradientScreen;
