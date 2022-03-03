import type {Socket} from "socket.io-client";
import type {NextPage} from "next";
import type {Message as IMessage} from "./types";

import {useEffect, useState} from "react";
import {Stack, StackDivider, Text, useClipboard, useToast} from "@chakra-ui/react";
import {CopyIcon, DeleteIcon, UnlockIcon} from "@chakra-ui/icons";

import type {EventMessage} from "~/types";

import {parseMessage} from "./utils";
import CopiedToast from "./components/CopiedToast";
import Bookmark from "./components/Bookmark";
import Message from "./components/Message";

import Navbar from "@/messages/components/Navbar";

interface Props {
  socket: Socket;
}

const DashboardScreen: NextPage<Props> = ({socket}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selected, setSelected] = useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = useState<IMessage["id"][]>([]);
  const {onCopy} = useClipboard(`http://localhost:6601/messages/showcase`);
  const toast = useToast();

  function handleToggleSelected(message: IMessage) {
    socket.emit("select", selected === message.id ? null : message);
  }

  function handleLeaveChannel() {
    socket.emit("channel", null);
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
      render: CopiedToast,
    });
  }

  useEffect(() => {
    socket.on("message", (event: EventMessage) => {
      setMessages((messages) => messages.concat(parseMessage(event)));
    });

    socket.on("select", (message: EventMessage) => setSelected(message?.id));

    return () => {
      socket.off("message");
      socket.off("select");
    };
  }, [socket]);

  return (
    <Stack height="100%" spacing={4}>
      <Navbar>
        <CopyIcon color="white" cursor="pointer" height={5} width={5} onClick={handleCopySource} />
        <DeleteIcon color="white" cursor="pointer" height={5} width={5} onClick={handleClear} />
        <UnlockIcon
          color="white"
          cursor="pointer"
          height={5}
          width={5}
          onClick={handleLeaveChannel}
        />
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
          <Text fontWeight="500" textStyle="title" textTransform="uppercase">
            All messages
          </Text>
          <Stack flex={1} overflowY="auto" spacing={4}>
            {messages.length ? (
              messages.map((message) => {
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
                      <Bookmark cursor="pointer" onClick={() => setBookmark(null)} />
                    )}
                  </Stack>
                );
              })
            ) : (
              <Text fontSize="xl" margin="auto" opacity={0.5}>
                No messages found yet on the channel
              </Text>
            )}
          </Stack>
        </Stack>
        <Stack flex={1}>
          <Text fontWeight="500" textStyle="title" textTransform="uppercase">
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

export default DashboardScreen;
