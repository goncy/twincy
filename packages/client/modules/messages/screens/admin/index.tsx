import type {Socket} from "socket.io-client";
import type {NextPage} from "next";
import type {Message as IMessage} from "./types";
import type {EventMessage} from "~/types";

import {useEffect, useMemo, useState} from "react";
import {Flex, Stack, StackDivider, Text} from "@chakra-ui/react";
import {ChatIcon, DeleteIcon, StarIcon} from "@chakra-ui/icons";

import {parseMessage} from "./utils";
import Message from "./components/Message";

import Navbar from "~/components/Navbar";

interface Props {
  socket: Socket;
}

const AdminScreen: NextPage<Props> = ({socket}) => {
  const [limit, setLimit] = useState<number>(100);
  const [buffer, setBuffer] = useState<IMessage[]>([]);
  const [selected, setSelected] = useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = useState<IMessage["id"][]>([]);
  const [isHighlights, toggleHighlights] = useState<boolean>(false);
  const messages = useMemo(() => {
    if (isHighlights) {
      return buffer.filter((message) => message.isHighlighted);
    }

    return buffer;
  }, [buffer, isHighlights]);

  function handleToggleSelected(message: IMessage) {
    socket.emit("messages:select", selected === message.id ? null : message);
  }

  function handleToggleFavorite(id: IMessage["id"]) {
    setFavorites((favorites) =>
      favorites.includes(id) ? favorites.filter((_id) => _id !== id) : favorites.concat(id),
    );
  }

  function handleToggleBookmark(id: IMessage["id"]) {
    setBookmark((_id) => (_id === id ? null : id));
  }

  function handleClear() {
    setBuffer([]);
    setSelected(null);
    setBookmark(null);
    setFavorites([]);
  }

  useEffect(() => {
    function handleSelect(message: EventMessage) {
      setSelected(message?.id);
    }

    function handleMessage(event: EventMessage) {
      setBuffer((messages) => messages.concat(parseMessage(event)));
    }

    socket.on("message", handleMessage);
    socket.on("messages:select", handleSelect);

    return () => {
      socket.off("message", handleMessage);
      socket.off("messages:select", handleSelect);
    };
  }, [socket]);

  return (
    <Stack backgroundColor="background" height="100%" spacing={4}>
      <Navbar>
        <Stack alignItems="center" direction="row" spacing={4}>
          <StarIcon
            color={isHighlights ? "secondary.500" : "white"}
            cursor="pointer"
            height={5}
            width={5}
            onClick={() => toggleHighlights((isHighlights) => !isHighlights)}
          />
          <DeleteIcon color="white" cursor="pointer" height={5} width={5} onClick={handleClear} />
        </Stack>
      </Navbar>
      <Stack
        direction="row"
        divider={<StackDivider />}
        flex={1}
        height="100%"
        overflow="hidden"
        paddingBottom={4}
        paddingX={4}
        spacing={4}
      >
        <Stack flex={1}>
          <Text color="solid" fontWeight="500" textTransform="uppercase">
            All messages
          </Text>
          <Stack flex={1} overflowY="auto" spacing={4}>
            {messages.length ? (
              <>
                {messages.length > limit && (
                  <Flex color="soft" justifyContent="center" padding={2}>
                    <Text
                      _hover={{textDecoration: "underline"}}
                      cursor="pointer"
                      fontWeight="500"
                      onClick={() => setLimit((limit) => limit + 10)}
                    >
                      {messages.length - limit} hidden messages
                    </Text>
                  </Flex>
                )}
                {messages.slice(-limit).map((message) => {
                  const isSelected = selected === message.id;

                  return (
                    <Stack key={message.id} spacing={4}>
                      <Message
                        badges={message.sender.badges}
                        isFavorite={favorites.includes(message.id)}
                        isHighlighted={message.isHighlighted}
                        isSelected={isSelected}
                        message={message}
                        sender={message.sender.name}
                        timestamp={message.timestamp}
                        onBookmark={() => handleToggleBookmark(message.id)}
                        onFavorite={() => handleToggleFavorite(message.id)}
                        onSelect={() => handleToggleSelected(message)}
                      />
                      {bookmark === message.id && (
                        <Flex
                          backgroundColor="secondary.500"
                          color="yellow.700"
                          cursor="pointer"
                          justifyContent="center"
                          padding={2}
                          onClick={() => setBookmark(null)}
                        >
                          <Stack alignItems="center" direction="row">
                            <ChatIcon />
                            <Text fontWeight="500">You are here</Text>
                          </Stack>
                        </Flex>
                      )}
                    </Stack>
                  );
                })}
              </>
            ) : (
              <Text fontSize="xl" margin="auto" opacity={0.5}>
                No messages found yet on the channel
              </Text>
            )}
          </Stack>
        </Stack>
        <Stack flex={1}>
          <Text color="solid" fontWeight="500" textTransform="uppercase">
            Favorites
          </Text>
          <Stack flex={1} overflowY="auto" spacing={4}>
            {Boolean(favorites.length) ? (
              buffer
                .filter((message) => favorites.includes(message.id))
                .map((message) => {
                  const isSelected = selected === message.id;

                  return (
                    <Message
                      key={message.id}
                      isFavorite
                      badges={message.sender.badges}
                      isHighlighted={message.isHighlighted}
                      isSelected={isSelected}
                      message={message}
                      sender={message.sender.name}
                      timestamp={message.timestamp}
                      onFavorite={() => handleToggleFavorite(message.id)}
                      onSelect={() => handleToggleSelected(message)}
                    />
                  );
                })
            ) : (
              <Text fontSize="xl" margin="auto" opacity={0.5}>
                No messages in favorites
              </Text>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AdminScreen;
