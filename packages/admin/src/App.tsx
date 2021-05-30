import * as React from "react";
import SocketIO from "socket.io-client";
import {Stack, StackDivider, Text} from "@chakra-ui/react";

import Message from "~/components/Message";
import {Message as IMessage} from "~/types";

import Bookmark from "./components/Bookmark";
import Navbar from "./components/Navbar";

const socket = SocketIO("http://localhost:8002");

const App: React.FC = () => {
  const [messages, setMessages] = React.useState<IMessage[]>([
    {
      id: "c35a7972-de4c-4c43-8736-813e29ad0809",
      sender: {
        badges: [
          "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
          "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
        ],
        name: "goncypozzo",
      },
      timestamp: 1622322887149,
      message: "Lorem ipsum",
      isHighlighted: false,
    },
    {
      id: "4c9a0ed0-4728-4c6c-ad89-7e32b3817a0c",
      sender: {
        badges: [
          "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
          "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
        ],
        name: "goncypozzo",
      },
      timestamp: 1622322890018,
      message: "dolor sit amet",
      isHighlighted: false,
    },
    {
      id: "511f1fdf-5eb2-4432-9551-0288d017442b",
      sender: {
        badges: [
          "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
          "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
        ],
        name: "goncypozzo",
      },
      timestamp: 1622322894165,
      message: "constectuer adipscing elit",
      isHighlighted: false,
    },
    {
      id: "2c9464d8-cb70-447f-88b4-119385aff1cd",
      sender: {
        badges: [
          "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
          "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
        ],
        name: "goncypozzo",
      },
      timestamp: 1622322922539,
      message: "sarasa la fasa",
      isHighlighted: true,
    },
    {
      id: "9818c4ae-21ec-4ba4-a0c3-963068b26e24",
      sender: {
        badges: [
          "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
          "https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1",
          "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
        ],
        name: "goncypozzo",
      },
      timestamp: 1622322953506,
      message: "Otra",
      isHighlighted: false,
    },
  ]);
  const [selected, setSelected] = React.useState<null | IMessage["id"]>(
    "9818c4ae-21ec-4ba4-a0c3-963068b26e24",
  );
  const [bookmark, setBookmark] = React.useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = React.useState<IMessage["id"][]>([
    "9818c4ae-21ec-4ba4-a0c3-963068b26e24",
    "2c9464d8-cb70-447f-88b4-119385aff1cd",
  ]);

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
        paddingBottom={3}
        paddingX={4}
        spacing={3}
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
