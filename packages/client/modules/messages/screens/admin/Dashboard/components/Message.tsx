import type {StackProps} from "@chakra-ui/react";

import {LockIcon, StarIcon} from "@chakra-ui/icons";
import {Stack, Box, Flex, Image, Text} from "@chakra-ui/react";

import type {EventMessage} from "~/types";

interface Props extends Omit<StackProps, "onSelect"> {
  variant?: "featured" | "normal";
  onFavorite?: (id: EventMessage["id"]) => void;
  onSelect?: (message: EventMessage) => void;
  onBookmark?: (id: EventMessage["id"]) => void;
  sender: string;
  badges?: string[];
  timestamp: number;
  message: EventMessage;
  isHighlighted?: boolean;
  isFavorite?: boolean;
  isSelected?: boolean;
}

const Message: React.FC<Props> = ({
  message,
  badges,
  timestamp,
  sender,
  onFavorite,
  onBookmark,
  onSelect,
  isSelected = false,
  isFavorite = false,
  isHighlighted = false,
  ...props
}) => {
  return (
    <Stack alignItems="flex-start" direction="row" spacing={3}>
      <Stack
        alignItems="flex-start"
        backgroundColor={isSelected ? "primary" : "content"}
        borderRadius="md"
        cursor={onSelect ? "pointer" : "inherit"}
        display="inline-flex"
        paddingX={4}
        paddingY={2}
        spacing={1}
        width="100%"
        wordBreak="break-word"
        onClick={({ctrlKey, altKey}) =>
          ctrlKey
            ? onFavorite?.(message.id)
            : altKey
            ? onBookmark?.(message.id)
            : onSelect?.(message)
        }
        {...props}
      >
        <Stack alignItems="center" direction="row">
          {Boolean(badges?.length) && (
            <Stack direction="row" spacing={1}>
              {badges?.map((badge) => (
                <Image
                  key={badge}
                  alt={badge}
                  height={5}
                  objectFit="contain"
                  src={badge}
                  width={5}
                />
              ))}
            </Stack>
          )}
          <Stack alignItems="center" direction="row">
            <Box
              alignItems="center"
              as="p"
              color={isSelected ? "white" : "solid"}
              dangerouslySetInnerHTML={{__html: sender}}
              display="inline-flex"
              fontSize="xl"
              fontWeight="normal"
              lineHeight="normal"
              textShadow="0 0 5px rgba(0,0,0,0.1)"
              textTransform="uppercase"
            />
            <Text color={isSelected ? "white" : "soft"} fontSize="xs">
              {new Date(Number(timestamp)).toLocaleTimeString()}
            </Text>
          </Stack>
        </Stack>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={6}
          width="100%"
        >
          <Box
            as="span"
            color={isSelected ? "white" : "soft"}
            dangerouslySetInnerHTML={{__html: message.message}}
            display="inline-block"
            fontSize="xl"
            sx={{
              "& i": {
                width: 6,
                height: 6,
                marginX: 1,
                backgroundSize: "contain",
                backgroundPosition: "center",
                display: "inline-block",
                verticalAlign: "sub",
              },
            }}
          />
        </Stack>
      </Stack>
      <Flex direction="column" height={74} justifyContent="space-between" paddingY={1.5}>
        <LockIcon color={isHighlighted ? "secondary" : "translucid"} height={6} width={6} />
        <StarIcon
          color={isFavorite ? "primary" : "translucid"}
          cursor="pointer"
          height={6}
          width={6}
          onClick={() => onFavorite?.(message.id)}
        />
      </Flex>
    </Stack>
  );
};

export default Message;
