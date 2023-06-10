"use client";

import { Alert, AlertIcon, AlertTitle, Box, CircularProgress, Flex } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { Channel, Message } from "../../discord/interface";

import Project from "./components/Project";
import ServerInfo from "./components/ServerInfo";

import api from "@/discord/api";

function ProjectsScreen() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState("initial");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const getMessages = async () => {
    setLoading(true);
    try {
      const messages = await api.messages.fetch(selectedChannel?.id!);

      setMessages(messages);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) setMessages([]);
      }
    }
    setLoading(false);
  };

  const handleVisitPage = (message: Message) => {
    api.messages.addReaction(selectedChannel?.id!, message.id, "⌛");
  };

  const handleInitVotation = (message: Message) => {
    setSelectedMessage(message);
    setStatus("active");
  };

  const handleCloseVotation = (message: Message) => {
    api.messages.deleteReaction(selectedChannel?.id!, message.id, "⌛");
    api.messages.addReaction(selectedChannel?.id!, message.id, "✅");
  };

  const handleEndVotation = (message: Message) => {
    api.messages.deleteReaction(selectedChannel?.id!, message.id, "⌛");
    api.messages.addReaction(selectedChannel?.id!, message.id, "✅");
    setStatus("initial");
    setMessages(
      (currentMessages) =>
        currentMessages?.filter((_message) => _message.id !== message.id) ?? null,
    );
  };

  const omitMessage = (message: Message) => {
    setMessages(
      (currentMessages) =>
        currentMessages?.filter((_message) => _message.id !== message.id) ?? null,
    );
  };

  const handleRejectProject = (message: Message) => {
    api.messages.deleteReaction(selectedChannel?.id!, message.id, "⌛");
    api.messages.addReaction(selectedChannel?.id!, message.id, "❌");
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
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      <Box backgroundColor="gray.700" padding={10}>
        <Flex justifyContent="center">
          <ServerInfo onChangeChannel={(channel) => setSelectedChannel(channel)!} />
        </Flex>
        {loading && (
          <Flex alignItems="center" justifyContent="center" marginTop={10}>
            <CircularProgress isIndeterminate />
          </Flex>
        )}
        {messages?.length === 0 && loading === false ? (
          <Alert mt={10} status="error">
            <AlertIcon />
            <AlertTitle>No se encontró el último proyecto visto</AlertTitle>
          </Alert>
        ) : (
          messages?.map((message) => (
            <Project
              key={message.id}
              message={message}
              selected={selectedMessage?.id === message.id}
              status={status}
              onCloseVotation={() => handleCloseVotation(message)}
              onEndVotation={() => handleEndVotation(message)}
              onInitVotation={() => handleInitVotation(message)}
              onOmit={() => omitMessage(message)}
              onReject={() => handleRejectProject(message)}
              onVisitPage={() => handleVisitPage(message)}
            />
          ))
        )}
      </Box>
    </Flex>
  );
}

export default ProjectsScreen;