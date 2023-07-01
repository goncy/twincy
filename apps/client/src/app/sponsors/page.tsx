"use client";

import {SimpleGrid, Stack, Text} from "@chakra-ui/react";
import Image from "next/image";

import leniolabs from "@/sponsor/logos/leniolabs.png";
import enviopack from "@/sponsor/logos/enviopack.png";
import kopius from "@/sponsor/logos/kopius.png";
import SponsorsScreen from "@/sponsor/screens";

const SponsorsPage = ({
  searchParams: {duration = "10000", loop = "60000", delay = "0"},
}: {
  searchParams: {
    duration: string;
    delay: string;
    loop: string;
  };
}) => {
  return (
    <>
      <SponsorsScreen delay={Number(delay)} duration={Number(duration)} loop={Number(loop)}>
        <Stack
          backgroundColor="gray.700"
          color="white"
          fontFamily="inter"
          fontSize="xl"
          lineHeight="1.1"
          padding={4}
          spacing={4}
          textAlign="center"
        >
          <Text fontWeight="bold" textTransform="uppercase">
            Este stream es auspiciado por
          </Text>
          <SimpleGrid columns={1} justifyItems="center" spacing={4}>
            <Image alt="Kopius" height={300} src={kopius} />
          </SimpleGrid>
        </Stack>
      </SponsorsScreen>
      <SponsorsScreen
        delay={Number(duration) + 2000 + Number(delay)}
        duration={Number(duration)}
        loop={Number(loop)}
      >
        <Stack
          backgroundColor="gray.700"
          color="white"
          fontFamily="inter"
          fontSize="xl"
          lineHeight="1.1"
          padding={4}
          spacing={4}
          textAlign="center"
        >
          <Text fontWeight="bold" textTransform="uppercase">
            Este stream es auspiciado por
          </Text>
          <SimpleGrid columns={2} justifyItems="center" spacing={4}>
            <Image alt="Leniolabs" height={150} src={leniolabs} />
            <Image alt="Enviopack" height={150} src={enviopack} />
          </SimpleGrid>
        </Stack>
      </SponsorsScreen>
    </>
  );
};

export default SponsorsPage;
