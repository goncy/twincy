import React from "react";
import {Box, Image, Stack, StackProps, Text, Flex} from "@chakra-ui/react";
import {LockIcon, StarIcon} from "@chakra-ui/icons";

import {Message as IMessage} from "~/types";

interface Props extends Omit<StackProps, "onSelect"> {
  variant?: "featured" | "normal";
  // onClick?: React.MouseEventHandler<HTMLElement>;
  onFavorite?: (id: IMessage["id"]) => void;
  onSelect?: (message: IMessage) => void;
  onBookmark?: (id: IMessage["id"]) => void;
  sender: string;
  badges?: string[];
  timestamp: number;
  message: IMessage;
  isHighlighted?: boolean;
  isFavorite?: boolean;
  isSelected?: boolean;
}

const Message: React.FC<Props> = ({
  onClick,
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
        borderRadius="md"
        cursor={onClick ? "pointer" : "inherit"}
        display="inline-flex"
        layerStyle={isSelected ? "alert" : "card"}
        paddingX={4}
        paddingY={2}
        spacing={1}
        variant="card"
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
                <Image key={badge} height={5} objectFit="contain" src={badge} width={5} />
              ))}
            </Stack>
          )}
          <Stack alignItems="center" direction="row">
            <Box
              alignItems="center"
              as="p"
              dangerouslySetInnerHTML={{__html: sender}}
              display="inline-flex"
              fontSize="xl"
              fontWeight="normal"
              lineHeight="normal"
              textShadow="0 0 5px rgba(0,0,0,0.1)"
              textStyle={isSelected ? "white" : "title"}
              textTransform="uppercase"
            />
            <Text fontSize="xs" textStyle={isSelected ? "white" : "soft"}>
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
            textStyle={isSelected ? "white" : "soft"}
          />
        </Stack>
      </Stack>
      <Flex direction="column" height={74} justifyContent="space-between" paddingY={1.5}>
        <LockIcon height={6} textStyle={isHighlighted ? "secondary" : "translucid"} width={6} />
        <StarIcon
          cursor="pointer"
          height={6}
          textStyle={isFavorite ? "primary" : "translucid"}
          width={6}
          onClick={() => onFavorite?.(message.id)}
        />
      </Flex>
    </Stack>
  );
};

export default Message;
