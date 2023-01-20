"use client";

import type {Message} from "@twincy/types";

import {FC} from "react";
import {useEffect, useState} from "react";
import {Box, Image, Stack, Text} from "@chakra-ui/react";
import {AnimatePresence, motion} from "framer-motion";

import {useSocket} from "@/socket/context";

const ChatIndexScreen: FC = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    function handleMesage(event: Message) {
      setMessages((messages) => [event, ...messages].slice(0, 20));
    }

    socket.on("message", handleMesage);

    return () => {
      socket.off("message", handleMesage);
    };
  }, [socket]);

  return (
    <Stack direction="column-reverse" height="100%" spacing={2} style={{color: "black"}}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.main
            key={message.id}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.9, opacity: 0}}
            initial={{scale: 0.9, opacity: 0}}
            transition={{type: "spring", duration: 0.5}}
          >
            <Stack
              alignItems="flex-start"
              backgroundColor="gray.800"
              borderRadius="lg"
              direction="row"
              padding={4}
              spacing={3}
              width="fit-content"
            >
              <Image
                alt={`${message.sender.name} profile picture`}
                backgroundColor="blackAlpha.700"
                borderRadius={9999}
                height={16}
                src={`/api/twitch/avatar?user=${message.sender.name}`}
                width={16}
              />
              <Stack spacing={0}>
                <Box
                  alignItems="center"
                  display="inline-flex"
                  fontSize="3.2rem"
                  fontWeight={500}
                  gap={3}
                  lineHeight="normal"
                  marginBottom={1}
                  textTransform="uppercase"
                >
                  <Text
                    as="span"
                    color="white"
                    dangerouslySetInnerHTML={{__html: message.sender.name}}
                    fontSize="2xl"
                  />
                  {Boolean(message.sender.badges?.length) && (
                    <Box as="span" display="inline-flex" gap={2}>
                      {message.sender.badges?.map((badge) => (
                        <Image key={badge} alt={badge} height={5} src={badge} width={5} />
                      ))}
                    </Box>
                  )}
                </Box>
                <Text
                  color="whiteAlpha.800"
                  dangerouslySetInnerHTML={{__html: message.message}}
                  display="inline-block"
                  fontSize="xl"
                  sx={{
                    "& i": {
                      width: 6,
                      height: 6,
                      margin: "auto 4px",
                      display: "inline-block",
                      verticalAlign: "sub",
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                    },
                  }}
                />
              </Stack>
            </Stack>
          </motion.main>
        ))}
      </AnimatePresence>
    </Stack>
  );
};

export default ChatIndexScreen;
