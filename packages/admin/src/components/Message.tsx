import React from "react";
import {Box, Image, Stack, StackProps, Text, Flex} from "@chakra-ui/react";
import {LockIcon, StarIcon} from "@chakra-ui/icons";

interface Props extends StackProps {
  variant?: "featured" | "normal";
  onClick?: React.MouseEventHandler<HTMLElement>;
  sender: string;
  badges?: string[];
  timestamp: number;
  message: string;
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
        onClick={(event) => onClick && onClick(event)}
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
            dangerouslySetInnerHTML={{__html: message}}
            display="inline-flex"
            fontSize="xl"
            sx={{
              "& img": {
                width: 8,
                height: 8,
                marginX: 1,
                objectFit: "contain",
              },
            }}
            textStyle={isSelected ? "white" : "soft"}
          />
        </Stack>
      </Stack>
      <Flex direction="column" height={74} justifyContent="space-between" paddingY={1.5}>
        <LockIcon height={6} textStyle={isHighlighted ? "secondary" : "translucid"} width={6} />
        <StarIcon height={6} textStyle={isFavorite ? "primary" : "translucid"} width={6} />
      </Flex>
    </Stack>
  );
};

export default Message;
