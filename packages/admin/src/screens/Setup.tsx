import type {Socket} from "socket.io-client";
import * as React from "react";
import {Button, Input, Stack, Text} from "@chakra-ui/react";

import Navbar from "~/components/Navbar";

interface Props {
  socket: Socket;
}

const SetupScreen: React.VFC<Props> = ({socket}) => {
  const [channel, setChannel] = React.useState<string>(() => localStorage.getItem("channel") || "");

  function handleSubmit(event: React.FormEvent<HTMLDivElement>) {
    event.preventDefault();

    socket.emit("channel", channel);
  }

  React.useEffect(() => {
    localStorage.setItem("channel", channel);
  }, [channel]);

  return (
    <Stack height="100%" spacing={4}>
      <Navbar />
      <Stack
        alignItems="center"
        flex={1}
        height="100%"
        justifyContent="center"
        overflow="hidden"
        paddingBottom={4}
        paddingX={4}
      >
        <Stack
          borderRadius="lg"
          borderWidth={1}
          maxWidth={320}
          padding={8}
          shadow="lg"
          width="100%"
        >
          <Text fontWeight="500" textStyle="title" textTransform="uppercase">
            Channel name
          </Text>
          <Stack as="form" overflowY="auto" spacing={4} onSubmit={handleSubmit}>
            <Input
              placeholder="goncypozzo"
              size="lg"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            />
            <Button colorScheme="primary" size="lg" type="submit">
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SetupScreen;
