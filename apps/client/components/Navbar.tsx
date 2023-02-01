import React from "react";
import {Stack, useColorMode, Box, Heading} from "@chakra-ui/react";
import {ChatIcon, SunIcon, MoonIcon} from "@chakra-ui/icons";

interface Props {
  children?: React.ReactNode;
}

const Navbar: React.VFC<Props> = ({children = null}) => {
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <Stack
      _dark={{backgroundColor: "dark.700"}}
      alignItems="center"
      backgroundColor="primary.500"
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
      <Stack alignItems="center" direction="row" spacing={4}>
        {children}
        <Box color="white" cursor="pointer" onClick={toggleColorMode}>
          {colorMode === "dark" ? (
            <SunIcon height={5} width={5} />
          ) : (
            <MoonIcon height={5} width={5} />
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default Navbar;
