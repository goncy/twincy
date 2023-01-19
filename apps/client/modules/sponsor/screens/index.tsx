"use client";

import {SimpleGrid, Stack, StackProps, Text} from "@chakra-ui/react";
import Image from "next/image";
import {useEffect, useState} from "react";

import leniolabs from "../logos/leniolabs.png";

type Props = {duration: number; loop: number};

const Banner: React.FC<StackProps> = ({opacity}) => {
  return (
    <Stack
      backgroundColor="gray.700"
      color="white"
      fontFamily="inter"
      fontSize="xl"
      height={290}
      lineHeight="1.1"
      opacity={opacity}
      padding={4}
      spacing={4}
      textAlign="center"
      transition="opacity 2s"
    >
      <Text fontWeight="bold" textTransform="uppercase">
        Este stream es auspiciado por
      </Text>
      <SimpleGrid columns={1} justifyItems="center" spacing={4}>
        <Image alt="Leniolabs" src={leniolabs} />
      </SimpleGrid>
    </Stack>
  );
};

const SponsorsBannerScreen: React.FC<Props> = ({duration, loop}) => {
  const [isShown, toggleShown] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    timeout = setTimeout(
      () => {
        setTimeout(() => {
          toggleShown((isShown) => !isShown);
        });
      },
      isShown ? duration : loop,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [duration, isShown, loop]);

  return <Banner opacity={isShown ? 1 : 0} transition="opacity 2s" />;
};

export default SponsorsBannerScreen;
