import React from "react";
import {useColorModeValue, Stack, useColorMode, Box, Heading} from "@chakra-ui/react";
import {ChatIcon, SunIcon, MoonIcon} from "@chakra-ui/icons";

interface Props {}

const Navbar: React.FC<Props> = () => {
  const backgroundColor = useColorModeValue("primary.500", "dark.900");
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <Stack
      alignItems="center"
      backgroundColor={backgroundColor}
      boxShadow="md"
      direction="row"
      justifyContent="space-between"
      padding={4}
    >
      <Heading color="white" fontSize="2xl" fontWeight="500">
        <Stack alignItems="center" direction="row" spacing={2}>
          <ChatIcon />
          <span>Twincy</span>
        </Stack>
      </Heading>
      <Box color="white" cursor="pointer" onClick={toggleColorMode}>
        {colorMode === "dark" ? (
          <SunIcon height={5} width={5} />
        ) : (
          <MoonIcon height={5} width={5} />
        )}
      </Box>
    </Stack>
  );
};

export default Navbar;
