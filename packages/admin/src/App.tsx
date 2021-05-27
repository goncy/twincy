import * as React from "react";
import SocketIO from "socket.io-client";
import {
  Box,
  Divider,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";

import Message from "~/Message";
import {Message as IMessage} from "~/types";

const socket = SocketIO("http://localhost:8002");

const App: React.FC = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [selected, setSelected] = React.useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = React.useState<null | IMessage["id"]>(null);
  const [queue, setQueue] = React.useState<IMessage["id"][]>([]);

  function handleToggleSelected(message: IMessage) {
    socket.emit("select", selected === message.id ? null : message);
  }

  function handleToggleQueue(id: IMessage["id"]) {
    setQueue((queue) =>
      queue.includes(id) ? queue.filter((_id) => _id !== id) : queue.concat(id),
    );
  }

  function handleToggleBookmark(id: IMessage["id"]) {
    setBookmark((_id) => (_id === id ? null : id));
  }

  React.useEffect(() => {
    socket.on("message", (message: IMessage) =>
      setMessages((messages) => messages.concat(message)),
    );
    socket.on("select", (message: IMessage) => setSelected(message?.id));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Stack height="100%" spacing={3}>
      <Stack
        alignItems="center"
        backgroundColor="purple.500"
        boxShadow="md"
        direction="row"
        justifyContent="space-between"
        paddingX={4}
        paddingY={3}
      >
        <Heading color="white" fontSize="2xl">
          Twincy
        </Heading>
        <IconButton
          aria-label="color mode"
          color="whiteAlpha.800"
          colorScheme="purple"
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          variant="unstyled"
          onClick={toggleColorMode}
        />
      </Stack>
      <Stack
        direction="row"
        divider={<StackDivider />}
        flex={1}
        height="100%"
        paddingBottom={3}
        spacing={3}
      >
        {messages.length ? (
          <Stack flex={1} overflowY="auto" spacing={3}>
            {messages.map((message) => {
              const isSelected = selected === message.id;

              return (
                <Box key={message.id}>
                  <Message
                    color={message.color}
                    message={message.message}
                    sender={message.sender}
                    variant={
                      isSelected
                        ? "featured"
                        : queue.includes(message.id)
                        ? "queue"
                        : message.isHighlighted
                        ? "highlighted"
                        : "normal"
                    }
                    onClick={({ctrlKey, altKey}) =>
                      ctrlKey
                        ? handleToggleQueue(message.id)
                        : altKey
                        ? handleToggleBookmark(message.id)
                        : handleToggleSelected(message)
                    }
                  />
                  {bookmark === message.id && (
                    <Divider
                      borderTopWidth={24}
                      cursor="pointer"
                      onClick={() => setBookmark(null)}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Text fontSize="xl" margin="auto" opacity={0.5}>
            No messages found yet on the channel
          </Text>
        )}
        {Boolean(queue.length) && (
          <Stack flex={1} overflowY="auto">
            {messages
              .filter((message) => queue.includes(message.id))
              .map((message) => {
                const isSelected = selected === message.id;

                return (
                  <Message
                    key={message.id}
                    color={message.color}
                    message={message.message}
                    sender={message.sender}
                    variant={isSelected ? "featured" : "normal"}
                    onClick={(event) =>
                      event.ctrlKey ? handleToggleQueue(message.id) : handleToggleSelected(message)
                    }
                  />
                );
              })}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default App;
