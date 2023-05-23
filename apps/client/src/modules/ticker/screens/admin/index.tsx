"use client";

import type {Message as IMessage} from "@twincy/types";

import {useEffect, useMemo, useState} from "react";
import {Flex, Stack, StackDivider, Text} from "@chakra-ui/react";
import {ChatIcon, DeleteIcon, LockIcon, StarIcon} from "@chakra-ui/icons";
import Head from "next/head";

import {includesString, parseMessage} from "./utils";
import Message from "./components/Message";
import SearchInput from "./components/SearchInput";

import Navbar from "~/components/Navbar";
import {useSocket} from "@/socket/context";

const TickerAdminScreen = () => {
  const socket = useSocket();
  const [limit, setLimit] = useState<number>(100);
  const [query, setQuery] = useState<null | string>(null);
  const [buffer, setBuffer] = useState<IMessage[]>([]);
  const [selected, setSelected] = useState<null | IMessage["id"]>(null);
  const [bookmark, setBookmark] = useState<null | IMessage["id"]>(null);
  const [favorites, setFavorites] = useState<IMessage["id"][]>([]);
  const [onlyHighlighted, toggleOnlyHighlighted] = useState<boolean>(false);
  const [showFavorites, toggleFavorites] = useState<boolean>(false);
  const messages = useMemo(() => {
    let draft = buffer;

    if (onlyHighlighted) {
      draft = draft.filter((message) => message.isHighlighted);
    }

    if (query) {
      draft = draft.filter((message) => includesString(message.message, query));
    }

    return draft;
  }, [buffer, query, onlyHighlighted]);

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
    function handleSelect(message: IMessage) {
      setSelected(message?.id);
    }

    function handleMessage(event: IMessage) {
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
    <>
      <Head>
        <title>Twincy - Messages</title>
      </Head>
      <Stack backgroundColor="background" height="100%" spacing={4}>
        <Navbar>
          <SearchInput value={query} onChange={setQuery} onClose={() => setQuery(null)} />
          <Stack alignItems="center" direction="row" spacing={4}>
            <LockIcon
              color={showFavorites ? "primary.500" : "white"}
              cursor="pointer"
              height={5}
              width={5}
              onClick={() => toggleFavorites((showFavorites) => !showFavorites)}
            />
            <StarIcon
              color={onlyHighlighted ? "secondary.500" : "white"}
              cursor="pointer"
              height={5}
              width={5}
              onClick={() => toggleOnlyHighlighted((isHighlights) => !isHighlights)}
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
            <Stack flex={1} overflowY="scroll" paddingRight={4} spacing={4}>
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
          {showFavorites && (
            <Stack flex={1}>
              <Text color="solid" fontWeight="500" textTransform="uppercase">
                Favorites
              </Text>
              <Stack flex={1} overflowY="scroll" paddingRight={4} spacing={4}>
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
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default TickerAdminScreen;
