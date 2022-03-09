import type {Socket} from "socket.io-client";
import type {NextPage} from "next";
import type {Review as IReview} from "../../types";

import {useEffect, useMemo, useState} from "react";
import {Flex, Stack, StackDivider, Text, useToast} from "@chakra-ui/react";
import {useRouter} from "next/router";

import type {EventMessage} from "~/types";
import Navbar from "~/components/Navbar";

import Review from "./components/Review";

interface Props {
  socket: Socket;
}

const ICONS: Record<IReview["type"], string> = {
  linkedin: "📄",
  portfolio: "🌐",
};

const AdminScreen: NextPage<Props> = ({socket}) => {
  const {
    query: {linkedinId, portfolioId, channel},
  } = useRouter();
  const [limit, setLimit] = useState<number>(100);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const {pending, completed} = useMemo<{pending: IReview[]; completed: IReview[]}>(
    () =>
      reviews.reduce<{pending: IReview[]; completed: IReview[]}>(
        (reviews, review) => {
          if (review.completed) {
            return {
              completed: reviews.completed.concat(review),
              pending: reviews.pending,
            };
          } else {
            return {
              completed: reviews.completed,
              pending: reviews.pending.concat(review),
            };
          }
        },
        {
          pending: [],
          completed: [],
        },
      ),
    [reviews],
  );
  const toast = useToast();

  function handleCopyUrl(review: IReview) {
    navigator.clipboard.writeText(review.url);

    toast({
      title: "Copied!",
      status: "success",
    });
  }

  function handleToggleSelected(review: IReview) {
    setReviews((reviews) =>
      reviews.map((_review) =>
        _review.id === review.id ? {...review, selected: !review.selected} : _review,
      ),
    );
  }

  function handleToggleCompleted(review: IReview) {
    setReviews((reviews) =>
      reviews.map((_review) =>
        _review.id === review.id ? {...review, completed: !review.completed} : _review,
      ),
    );
  }

  useEffect(() => {
    function handleMessage(event: EventMessage) {
      // Check if user used channel points
      const isFeatured = [linkedinId, portfolioId].includes(event.tags["custom-reward-id"]);

      // Get review type
      const type =
        (isFeatured && event.tags["custom-reward-id"] === linkedinId) ||
        (!isFeatured && event.message.startsWith("!linkedin "))
          ? "linkedin"
          : (isFeatured && event.tags["custom-reward-id"] === portfolioId) ||
            (!isFeatured && event.message.startsWith("!portfolio "))
          ? "portfolio"
          : null;

      // Return if not a valid type
      if (!type) {
        return;
      }

      // Set reviews
      setReviews((reviews) => {
        // Create a draft
        let draft = [...reviews];

        // Remove repeated reviews
        draft = draft.filter(
          (review) => !(review.sender.name === event.sender.name && review.type === type),
        );

        // Add the new review
        draft = draft.concat({
          id: `${event.sender.name}-${type}`,
          type,
          completed: false,
          selected: false,
          url: event.message.replace(`!${type} `, ""),
          icon: ICONS[type],
          sender: event.sender,
          color: event.color,
          featured: isFeatured,
          timestamp: +new Date(),
        });

        // Sort reviews
        draft.sort((a, b) => {
          // Featured should go first
          if (b.featured && !a.featured) {
            return 1;
          }

          // Featured should go first
          if (a.featured && !b.featured) {
            return -1;
          }

          // Sort by timestamp
          return a.timestamp - b.timestamp;
        });

        return draft;
      });
    }

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [channel, linkedinId, portfolioId, socket]);

  useEffect(() => {
    socket.emit("reviews:replace", reviews);
  }, [socket, reviews]);

  return (
    <Stack backgroundColor="background" height="100%" spacing={4}>
      <Navbar />
      <Stack
        backgroundColor="background"
        direction="row"
        divider={<StackDivider />}
        flex={1}
        height="100%"
        overflow="hidden"
        paddingX={4}
        spacing={4}
      >
        <Stack flex={1}>
          <Text color="solid" fontWeight="500" textTransform="uppercase">
            Queue
          </Text>
          <Stack flex={1} overflowY="auto" spacing={4}>
            {pending.length ? (
              <>
                {pending.length > limit && (
                  <Flex color="soft" justifyContent="center" padding={2}>
                    <Text
                      _hover={{textDecoration: "underline"}}
                      cursor="pointer"
                      fontWeight="500"
                      onClick={() => setLimit((limit) => limit + 10)}
                    >
                      {reviews.length - limit} hidden messages
                    </Text>
                  </Flex>
                )}
                {pending.slice(-limit).map((review) => {
                  return (
                    <Review
                      key={review.id}
                      review={review}
                      onComplete={() => handleToggleCompleted(review)}
                      onCopy={() => handleCopyUrl(review)}
                      onSelect={() => handleToggleSelected(review)}
                    />
                  );
                })}
              </>
            ) : (
              <Text fontSize="xl" margin="auto" opacity={0.5}>
                No reviews found yet on the channel
              </Text>
            )}
          </Stack>
        </Stack>
        <Stack flex={1}>
          <Text color="solid" fontWeight="500" textTransform="uppercase">
            Completed
          </Text>
          <Stack flex={1} overflowY="auto" spacing={4}>
            {Boolean(completed.length) ? (
              completed.map((review) => {
                return (
                  <Review
                    key={review.id}
                    review={review}
                    onComplete={() => handleToggleCompleted(review)}
                    onSelect={() => handleToggleSelected(review)}
                  />
                );
              })
            ) : (
              <Text fontSize="xl" margin="auto" opacity={0.5}>
                No completed reviews
              </Text>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AdminScreen;
