import type {NextPage} from "next";
import type {Socket} from "socket.io-client";
import type {Review} from "../../types";

import {useEffect, useState} from "react";
import {Stack, StackDivider, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";

interface Props {
  socket: Socket;
}

const ReviewScreen: NextPage<Props> = ({socket}) => {
  const {
    query: {channel, command},
  } = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Replace all reviews
    function handleReplace(reviews: Review[]) {
      setReviews(reviews.filter((review) => !review.completed));
    }

    // Listen for messages
    socket.on("reviews:replace", handleReplace);

    return () => {
      // Remove listener when unmounting
      socket.off("reviews:replace", handleReplace);
    };
  }, [socket, channel]);

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
      spacing={3}
      width="100vw"
    >
      <Stack alignItems="center" direction="row" flex={1}>
        <Text as="span" display="inline-flex" gap={1}>
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
        >
          {reviews.map((review) => (
            <Text
              key={review.sender.name}
              as="span"
              backgroundColor={review.selected ? "primary.500" : "transparent"}
              color={review.selected ? "white" : review.featured ? "secondary.600" : "primary.500"}
              paddingX={2}
              paddingY={1}
              textShadow="sm"
            >
              {review.sender.name}
            </Text>
          ))}
        </Stack>
      </Stack>
      <Text as="span">
        Sumá el tuyo con:{" "}
        <Text as="span" color="primary.500">
          {command}
        </Text>{" "}
        <Text as="span" color="blackAlpha.600">{`<url>`}</Text>
      </Text>
    </Stack>
  );
};

export default ReviewScreen;
