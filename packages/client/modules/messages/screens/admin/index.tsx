import type {Socket} from "socket.io-client";
import type {NextPage} from "next";
import type {Message as IMessage} from "./types";

import {useEffect, useState} from "react";
import {
  Alert,
  AlertIcon,
  Flex,
  Stack,
  StackDivider,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import {ChatIcon, CopyIcon, DeleteIcon} from "@chakra-ui/icons";
import {useRouter} from "next/router";

import type {EventMessage} from "~/types";

import {parseMessage} from "./utils";
import Message from "./components/Message";
import Navbar from "./components/Navbar";

interface Props {
  socket: Socket;
}

const AdminScreen: NextPage<Props> = ({socket}) => {
  const {
    query: {channel},
  } = useRouter();
  const [limit, setLimit] = useState<number>(100);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selected, setSelected] = useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = useState<IMessage["id"][]>([]);
  const {onCopy} = useClipboard(`http://localhost:6601/messages/showcase?channel=${channel}`);
  const toast = useToast();

  function handleToggleSelected(message: IMessage) {
    socket.emit("select", selected === message.id ? null : message);
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
    setMessages([]);
    setSelected(null);
    setBookmark(null);
    setFavorites([]);
  }

  function handleCopySource() {
    onCopy();
    toast({
      duration: 5000,
      render: () => (
        <Alert backgroundColor="primary.500" color="white" status="success" variant="solid">
          <AlertIcon />
          Browser source link copied to clipboard!
        </Alert>
      ),
    });
  }

  useEffect(() => {
    function handleSelect(message: EventMessage) {
      setSelected(message?.id);
    }

    function handleMesage(event: EventMessage) {
      setMessages((messages) => messages.concat(parseMessage(event)));
    }

    socket.on("message", handleMesage);
    socket.on("select", handleSelect);

    return () => {
      socket.off("message", handleMesage);
      socket.off("select", handleSelect);
    };
  }, [socket]);

  return (
    <Stack backgroundColor="background" height="100%" spacing={4}>
      <Navbar>
        <Stack alignItems="center" direction="row" spacing={4}>
          <CopyIcon
            color="white"
            cursor="pointer"
            height={5}
            width={5}
            onClick={handleCopySource}
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
              messages
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
