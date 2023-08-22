"use client";

import type {Message} from "@twincy/types";

import {useEffect, useMemo, useState} from "react";
import {Box, Stack, Text} from "@chakra-ui/react";
import {useSearchParams} from "next/navigation";
import Confetti from "react-confetti";

import {useSocket} from "@/socket/context";

export default function RatingScreen() {
  const socket = useSocket();
  const [status, setStatus] = useState<"inactive" | "active" | "closed">("inactive");
  const [votes, setVotes] = useState<Map<string, number>>(() => new Map<string, number>());
  const [answers, setAnswers] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const rating = useMemo(
    () => Math.round(Array.from(votes.values()).reduce((acc, vote) => acc + vote, 0) / votes.size),
    [votes],
  );

  useEffect(() => {
    const handleMessage = (event: Message) => {
      if (searchParams.get("channel")?.toLowerCase() === event.sender.name.toLowerCase()) {
        if (event.message.startsWith("!ratingstart")) {
          const [, max = 5] = event.message.split("!ratingstart ");

          setStatus("active");
          setAnswers(Array.from({length: Number(max)}, (_value, index) => index + 1));
        } else if (event.message.startsWith("!ratingclose")) {
          setStatus("closed");
        } else if (event.message.startsWith("!ratingend")) {
          setStatus("inactive");
          setVotes(new Map());
          setAnswers([]);
        }
      }

      if (status === "active") {
        if (answers.includes(Number(event.message.trim()))) {
          const draft = new Map(votes);

          draft.set(event.sender.name, Number(event.message.trim()));

          setVotes(draft);
        }
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, status, votes, answers, searchParams]);

  if (status === "inactive") return null;

  return (
    <>
      {status === "closed" && <Confetti gravity={0.5} />}
      <Stack alignItems="center" height="100vh" justifyContent="center" spacing={2} width="100vw">
        <Box
          color="yellow.400"
          display="flex"
          flexDirection="column"
          fontSize="6xl"
          fontWeight="bold"
          textAlign="left"
          textShadow="2px 2px 0px rgba(32, 32, 32, 0.5)"
        >
          <p>{"★".repeat(rating).padEnd(answers.length, "☆")}</p>
        </Box>
        <Text
          backgroundColor="gray.800"
          borderColor="gray.600"
          borderRadius={4}
          borderWidth={1}
          color="white"
          fontSize="2xl"
          paddingX={3}
          paddingY={2}
          rounded="sm"
          shadow="2xl"
          textAlign="center"
        >
          {votes.size} voto(s)
        </Text>
      </Stack>
    </>
  );
}
