import type {Socket} from "socket.io-client";
import * as React from "react";
import {
  Stack,
  StackDivider,
  Text,
  useClipboard,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {CopyIcon, DeleteIcon, UnlockIcon} from "@chakra-ui/icons";

import type {Message as IMessage} from "~/types";
import Message from "~/components/Message";
import Bookmark from "~/components/Bookmark";
import Navbar from "~/components/Navbar";

interface Props {
  socket: Socket;
}

const CopiedToast = () => (
  <Alert backgroundColor="primary.500" color="white" status="success" variant="solid">
    <AlertIcon />
    Browser souce link copied to clipboard!
  </Alert>
);

const DashboardScreen: React.VFC<Props> = ({socket}) => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [selected, setSelected] = React.useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = React.useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = React.useState<IMessage["id"][]>([]);
  const {onCopy} = useClipboard(
    process.env.NODE_ENV === "production"
      ? `http://localhost:6600/client`
      : `http://localhost:6601`,
  );
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

  React.useEffect(() => {
    socket.on("message", (message: IMessage) => {
      setMessages((messages) => messages.concat(message));
    });

    socket.on("select", (message: IMessage) => setSelected(message?.id));

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
