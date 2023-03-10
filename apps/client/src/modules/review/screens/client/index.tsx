"use client";

import type {Review} from "@twincy/types";

import {useEffect, useState} from "react";
import {Stack, StackDivider, Text} from "@chakra-ui/react";

import {useSocket} from "@/socket/context";

interface Props {
  command: string;
}

const ReviewClientScreen = ({command}: Props) => {
  const socket = useSocket();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Replace all reviews
    function handleReplace(reviews: Review[]) {
      setReviews(reviews.filter((review) => !review.completed));
    }

    // Listen for messages
    socket.on("review:replace", handleReplace);

    return () => {
      // Remove listener when unmounting
      socket.off("review:replace", handleReplace);
    };
  }, [socket]);

  // Hide if no reviews
  if (!reviews.length) return null;

  return (
    <Stack
      alignItems="center"
      backgroundColor="white"
      color="black"
      direction="row"
      divider={<StackDivider />}
      fontSize="xl"
      fontWeight={500}
      justifyContent="space-between"
      paddingX={4}
      paddingY={1}
      spacing={1}
      width="100vw"
    >
      <Text as="span" display="inline-flex" flexShrink={0} gap={1}>
        Próximos <Text color="blackAlpha.600">({reviews.length} total)</Text>:{" "}
      </Text>
      <Stack
        alignItems="center"
        direction="row"
        divider={
          <Text color="blackAlpha.600" marginX={1}>
            {" "}
            ·{" "}
          </Text>
        }
        flexGrow={1}
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {reviews.map((review) => (
          <Text
            key={review.sender.name}
            as="span"
            backgroundColor={review.selected ? "primary.500" : "transparent"}
            color={review.selected ? "white" : "primary.500"}
            paddingX={2}
            paddingY={1}
            textShadow="sm"
          >
            {review.sender.name}
          </Text>
        ))}
      </Stack>
      <Text
        as="span"
        borderLeftColor="blackAlpha.300"
        borderLeftWidth={1}
        flexShrink={0}
        paddingLeft={3}
      >
        Sumá el tuyo con:{" "}
        <Text as="span" color="primary.500">
          {command}
        </Text>{" "}
        <Text as="span" color="blackAlpha.600">{`<url>`}</Text>
      </Text>
    </Stack>
  );
};

export default ReviewClientScreen;
