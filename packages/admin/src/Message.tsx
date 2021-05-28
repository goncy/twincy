import React from "react";
import {Box, Image, Stack, StackProps, useColorMode, Text} from "@chakra-ui/react";

interface Props extends StackProps {
  variant?: "highlighted" | "queue" | "featured" | "normal";
  onClick?: React.MouseEventHandler<HTMLElement>;
  sender: string;
  badges?: string[];
  timestamp: number;
  message: string;
  color: string;
}

const COLORS = {
  highlighted: {
    light: {
      backgroundColor: "purple.100",
      color: "purple.500",
      timestampColor: "blackAlpha.700",
    },
    dark: {
      backgroundColor: "purple.800",
      color: "purple.100",
      timestampColor: "whiteAlpha.700",
    },
  },
  queue: {
    light: {
      backgroundColor: "yellow.100",
      color: "yellow.500",
      timestampColor: "blackAlpha.700",
    },
    dark: {
      backgroundColor: "yellow.900",
      color: "yellow.100",
      timestampColor: "whiteAlpha.700",
    },
  },
  featured: {
    light: {
      backgroundColor: "purple.500",
      color: "purple.50",
      timestampColor: "blackAlpha.700",
    },
    dark: {
      backgroundColor: "purple.500",
      color: "purple.50",
      timestampColor: "whiteAlpha.700",
    },
  },
  normal: {
    light: {
      backgroundColor: "transparent",
      color: "blackAlpha.800",
      timestampColor: "blackAlpha.700",
    },
    dark: {
      backgroundColor: "transparent",
      color: "whiteAlpha.800",
      timestampColor: "whiteAlpha.700",
    },
  },
};

const Message: React.FC<Props> = ({
  variant = "normal",
  onClick,
  color,
  message,
  badges,
  timestamp,
  sender,
  ...props
}) => {
  const {colorMode} = useColorMode();

  return (
    <Stack
      alignItems="flex-start"
      backgroundColor={COLORS[variant][colorMode].backgroundColor}
      boxShadow={variant === "featured" ? "xl" : "none"}
      cursor={onClick ? "pointer" : "inherit"}
      display="inline-flex"
      paddingX={4}
      paddingY={2}
      spacing={1}
      transition="box-shadow, color, background-color .25s"
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
            color={variant === "normal" ? color : COLORS[variant][colorMode].color}
            dangerouslySetInnerHTML={{__html: sender}}
            display="inline-flex"
            fontSize="xl"
            fontWeight="bold"
            lineHeight="normal"
            textShadow="0 0 5px rgba(0,0,0,0.1)"
            textTransform="uppercase"
          />
          <Text color={COLORS[variant][colorMode].timestampColor} fontSize="xs">
            {new Date(Number(timestamp)).toLocaleTimeString()}
          </Text>
        </Stack>
      </Stack>
      <Box
        as="span"
        color={COLORS[variant][colorMode].color}
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
      />
    </Stack>
  );
};

export default Message;
