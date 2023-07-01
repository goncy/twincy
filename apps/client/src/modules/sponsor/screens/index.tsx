"use client";

import {Box} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";

const SponsorsBannerScreen = ({
  duration,
  loop,
  delay,
  children,
}: {
  duration: number;
  loop: number;
  delay: number;
  children: React.ReactNode;
}) => {
  const hasStarted = useRef(false);
  const [isShown, toggleShown] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    timeout = setTimeout(
      () => {
        setTimeout(() => {
          toggleShown((isShown) => !isShown);
        });
      },
      isShown ? duration : hasStarted.current ? loop : delay,
    );

    hasStarted.current = true;

    return () => {
      clearTimeout(timeout);
    };
  }, [duration, isShown, loop, delay]);

  return (
    <Box
      height="100%"
      left={0}
      opacity={isShown ? 1 : 0}
      position="absolute"
      top={0}
      transition="opacity 2s"
      width="100%"
    >
      {children}
    </Box>
  );
};

export default SponsorsBannerScreen;
