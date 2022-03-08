import type {NextPage} from "next";
import type {Socket} from "socket.io-client";

import {useEffect, useState} from "react";
import {Text} from "@chakra-ui/react";
import {useRouter} from "next/router";

import {EventMessage} from "~/types";

interface Props {
  socket: Socket;
}

interface Review {
  type: "linkedin" | "portfolio";
  user: string;
  icon: string;
  color: string;
  featured: boolean;
  timestamp: number;
}

const ICONS: Record<Review["type"], string> = {
  linkedin: "📄",
  portfolio: "🌐",
};

const ReviewScreen: NextPage<Props> = ({socket}) => {
  const {
    query: {linkedinId, portfolioId, channel},
  } = useRouter();
  const [queue, setQueue] = useState<Review[]>([]);

  useEffect(() => {
    function handleMesage(event: EventMessage) {
      // Remove reviews from queue
      if (
        event.message.startsWith(`!review `) &&
        (event.tags.mod || event.sender.name === channel)
      ) {
        // Parse message
        const [type, user] = event.message
          .replace("!review ", "")
          .replaceAll("@", "")
          .toLowerCase()
          .split(" ");

        // Remove review
        setQueue((queue) =>
          queue.filter((review) => !(review.type === type && review.user === user)),
        );

        // Early return
        return;
      }

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

      // Update queue
      setQueue((queue) => {
        // Create a draft
        let draft = [...queue];

        // Remove repeated reviews
        draft = draft.filter(
          (review) => !(review.user === event.sender.name && review.type === type),
        );

        // Add the new review
        draft = draft.concat({
          type,
          icon: ICONS[type],
          user: event.sender.name.toLowerCase(),
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

    // Listen for messages
    socket.on("message", handleMesage);

    return () => {
      // Remove listener when unmounting
      socket.off("message", handleMesage);
    };
  }, [channel, socket, linkedinId, portfolioId]);

  if (!queue.length) return null;

  return (
    <Text
      backgroundColor="white"
      color="black"
      display="inline-flex"
      flexWrap="wrap"
      fontFamily="'Press Start 2P'"
      gap={3}
      padding={2}
    >
      Próximas revisiones:{" "}
      {queue.map((review) => (
        <Text
          key={`${review.user}-${review.type}`}
          as="span"
          color={review.featured ? "goldenrod" : review.color}
        >
          {review.icon} {review.user}
        </Text>
      ))}
    </Text>
  );
};

export default ReviewScreen;
