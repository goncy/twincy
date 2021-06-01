import * as React from "react";
import SocketIO from "socket.io-client";
import {Stack, StackDivider, Text} from "@chakra-ui/react";

import Message from "~/components/Message";
import {Message as IMessage} from "~/types";

import Bookmark from "./components/Bookmark";
import Navbar from "./components/Navbar";

const socket = SocketIO("http://localhost:8002");

const App: React.FC = () => {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [selected, setSelected] = React.useState<null | IMessage["id"]>();
  const [bookmark, setBookmark] = React.useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = React.useState<IMessage["id"][]>([]);

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
    <Stack height="100%" spacing={12}>
      <Navbar />
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
                      message={message.message}
                      sender={message.sender.name}
                      timestamp={message.timestamp}
                      onClick={({ctrlKey, altKey}) =>
                        ctrlKey
                          ? handleToggleFavorite(message.id)
                          : altKey
                          ? handleToggleBookmark(message.id)
                          : handleToggleSelected(message)
                      }
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
                      message={message.message}
                      sender={message.sender.name}
                      timestamp={message.timestamp}
                      onClick={(event) =>
                        event.ctrlKey
                          ? handleToggleFavorite(message.id)
                          : handleToggleSelected(message)
                      }
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

export default App;
