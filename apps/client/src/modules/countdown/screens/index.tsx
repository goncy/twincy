"use client";

import {useEffect, useState} from "react";
import {Stack, Text} from "@chakra-ui/react";

type Props = {timer: number; text?: string};

type CountdownProps = {
  seconds: number;
};

const Countdown: React.FC<CountdownProps> = ({seconds}) => {
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

const CountdownScreen: React.FC<Props> = ({timer, text}) => {
  return (
    <Stack color="white" fontFamily="inter" lineHeight="1.1" spacing={0} textAlign="right">
      {text && (
        <Text
          bgClip="text"
          bgGradient="linear(to-r, twitter.300, primary.300)"
          fontSize="9rem"
          fontWeight="700"
        >
          {text}
        </Text>
      )}
      <Countdown seconds={timer} />
    </Stack>
  );
};

export default CountdownScreen;
