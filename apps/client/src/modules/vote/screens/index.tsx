"use client";

import type {Message} from "@twincy/types";

import {useEffect, useMemo, useState} from "react";
import {List, ListItem, Stack, Text} from "@chakra-ui/react";
import {useSearchParams} from "next/navigation";
import Confetti from "react-confetti";

import {useSocket} from "@/socket/context";

export default function VoteScreen() {
  const socket = useSocket();
  const [status, setStatus] = useState<"inactive" | "active" | "closed">("inactive");
  const [votes, setVotes] = useState<Map<string, string>>(() => new Map<string, string>());
  const [answers, setAnswers] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const scores = useMemo(
    () =>
      Array.from(votes.values()).reduce((acc, vote) => {
        if (!acc.has(String(vote))) acc.set(String(vote), 0);

        acc.set(String(vote), acc.get(String(vote))! + 1);

        return acc;
      }, new Map<string, number>(answers.map((answer) => [answer, 0]))),
    [votes, answers],
  );

  useEffect(() => {
    const handleMessage = (event: Message) => {
      if (searchParams.get("channel")?.toLowerCase() === event.sender.name.toLowerCase()) {
        if (event.message.startsWith("!votestart")) {
          const [, rest] = event.message.split("!votestart ");

          setStatus("active");
          setAnswers(rest.split(",").map((answer) => answer.trim().toLowerCase()));
        } else if (event.message.startsWith("!voteclose")) {
          setStatus("closed");
        } else if (event.message.startsWith("!voteend")) {
          setStatus("inactive");
          setVotes(new Map());
          setAnswers([]);
        }
      }

      if (status === "active") {
        if (answers.includes(event.message.trim().toLowerCase())) {
          const draft = new Map(votes);

          draft.set(event.sender.name, event.message.trim().toLowerCase());

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
      <Stack alignItems="center" height="100vh" justifyContent="center" spacing={4} width="100vw">
        <List
          backgroundColor="white"
          borderColor="gray.100"
          borderRadius={4}
          borderWidth={1}
          color="black"
          display="flex"
          flexDirection="column"
          fontSize="5xl"
          fontWeight="bold"
          padding={6}
          shadow="2xl"
          textAlign="left"
        >
          {Array.from(scores.entries()).map(([option, score]) => (
            <ListItem
              key={option}
              alignItems="center"
              display="inline-flex"
              gap={8}
              justifyContent="space-between"
            >
              <p>{option}: </p>
              <p>{score ? Math.round((score / votes.size) * 100) : 0}%</p>
            </ListItem>
          ))}
        </List>
        <Text
          backgroundColor="gray.800"
          borderColor="gray.600"
          borderRadius={4}
          borderWidth={1}
          color="white"
          fontSize="3xl"
          padding={3}
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
