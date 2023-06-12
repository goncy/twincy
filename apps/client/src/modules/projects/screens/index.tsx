"use client";

import { Alert, AlertIcon, AlertTitle, Box, CircularProgress, Flex, Text } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { type APIChannel, type APIMessage } from "discord-api-types/v10";
import { useEffect, useState } from "react";

import Project from "./components/Project";
import ServerInfo from "./components/ServerInfo";

import api from "@/discord/api";
import { useSocket } from "@/socket/context";

function ProjectsScreen() {
  const [messages, setMessages] = useState<APIMessage[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [status, setStatus] = useState<"inactive" | "active" | "closed">("inactive");
  const [selectedMessage, setSelectedMessage] = useState<APIMessage | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<APIChannel | null>(null);
  const socket = useSocket();
  const guildID = "505180649787752450";

  const getMessages = async () => {
    setLoading(true);
    setError(false);
    try {
      const messages = await api.messages.fetch(selectedChannel?.id!);

      setMessages(messages);
      setError(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          setMessages(null);
          setError(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVisitPage = (message: APIMessage) => {
    api.messages.addReaction(selectedChannel?.id!, message.id, "⌛");
  };

  const handleInitVotation = (message: APIMessage) => {
    const options = "1,2,3,4,5";

    setSelectedMessage(message);
    setStatus("active");
    socket.emit("votation:start", options);
  };

  const handleCloseVotation = (message: APIMessage) => {
    api.messages.deleteReaction(selectedChannel?.id!, message.id, "⌛");
    api.messages.addReaction(selectedChannel?.id!, message.id, "✅");
    setStatus("closed");
    socket.emit("votation:close");
  };

  const handleEndVotation = (message: APIMessage) => {
    api.messages.deleteReaction(selectedChannel?.id!, message.id, "⌛");
    api.messages.addReaction(selectedChannel?.id!, message.id, "✅");
    setStatus("inactive");
    setMessages(
      (currentMessages) =>
        currentMessages?.filter((_message) => _message.id !== message.id) ?? null,
    );
    socket.emit("votation:end");
  };

  const omitMessage = (message: APIMessage) => {
    setMessages(
      (currentMessages) =>
        currentMessages?.filter((_message) => _message.id !== message.id) ?? null,
    );
  };

  const handleRejectProject = (message: APIMessage) => {
    api.messages.deleteReaction(selectedChannel?.id!, message.id, "⌛");
    api.messages.addReaction(selectedChannel?.id!, message.id, "❌");
    setStatus("inactive");
    setMessages(
      (currentMessages) =>
        currentMessages?.filter((_message) => _message.id !== message.id) ?? null,
    );
  };

  useEffect(() => {
    if (selectedChannel) getMessages();
  }, [selectedChannel]);

  return (
    <Flex
      alignItems="center"
      backgroundColor="gray.800"
      direction="column"
      height="100%"
      justifyContent="center"
      minHeight="100vh"
      width="100vw"
    >
      <Box backgroundColor="#2b2d31" maxHeight="70%" padding={10}>
        <Flex height={100} justifyContent="center">
          <ServerInfo
            guildID={guildID}
            onChangeChannel={(channel) => setSelectedChannel(channel)!}
          />
        </Flex>
        {loading && (
          <Flex alignItems="center" justifyContent="center" marginTop={10}>
            <CircularProgress isIndeterminate />
          </Flex>
        )}
        {error && (
          <Alert mt={5} status="error">
            <AlertIcon />
            <AlertTitle>No se encontró el último proyecto visto</AlertTitle>
          </Alert>
        )}
        {messages?.length === 0 && (
          <Box textAlign="center">
            <Text fontSize="2xl">Terminamos! ✨</Text>
            <Text fontSize="lg">No quedan más proyectos por revisar</Text>
          </Box>
        )}
        {!error && !loading && messages?.length! > 0 && (
          <Box
            backgroundColor="#313338"
            height="calc(100% - 100px)"
            overflowY="auto"
            paddingRight={8}
          >
            {messages?.map((message) => (
              <Project
                key={message.id}
                guildID={guildID}
                message={message}
                selected={selectedMessage?.id === message.id}
                votingClosed={status === "closed"}
                onCloseVotation={() => handleCloseVotation(message)}
                onEndVotation={() => handleEndVotation(message)}
                onInitVotation={() => handleInitVotation(message)}
                onOmit={() => omitMessage(message)}
                onReject={() => handleRejectProject(message)}
                onVisitPage={() => handleVisitPage(message)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Flex>
  );
}

export default ProjectsScreen;
