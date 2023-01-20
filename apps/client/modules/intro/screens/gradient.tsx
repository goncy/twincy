"use client";

import {FC} from "react";
import {Box, Stack, keyframes} from "@chakra-ui/react";

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
    </Stack>
  );
};

export default GradientScreen;
