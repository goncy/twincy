import React from "react";
import {Box, Stack, StackProps, useColorMode} from "@chakra-ui/react";

interface Props extends StackProps {
  variant?: "highlighted" | "queue" | "featured" | "normal";
  onClick?: React.MouseEventHandler<HTMLElement>;
  sender: string;
  message: string;
  color: string;
}

const COLORS = {
  highlighted: {
    light: {
      backgroundColor: "purple.100",
      color: "purple.500",
    },
    dark: {
      backgroundColor: "purple.800",
      color: "purple.100",
    },
  },
  queue: {
    light: {
      backgroundColor: "yellow.100",
      color: "yellow.500",
    },
    dark: {
      backgroundColor: "yellow.900",
      color: "yellow.100",
    },
  },
  featured: {
    light: {
      backgroundColor: "purple.500",
      color: "purple.50",
    },
    dark: {
      backgroundColor: "purple.500",
      color: "purple.50",
    },
  },
  normal: {
    light: {
      backgroundColor: "transparent",
      color: "blackAlpha.800",
    },
    dark: {
      backgroundColor: "transparent",
      color: "whiteAlpha.800",
    },
  },
};

const Message: React.FC<Props> = ({
  variant = "normal",
  onClick,
  color,
  message,
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
      direction="row"
      display="inline-flex"
      paddingX={4}
      paddingY={2}
      spacing={2}
      transition="box-shadow, color, background-color .25s"
      width="100%"
      onClick={(event) => onClick && onClick(event)}
      {...props}
    >
      <Box
        _after={{content: "': '"}}
        as="span"
        color={variant === "normal" ? color : COLORS[variant][colorMode].color}
        dangerouslySetInnerHTML={{__html: sender}}
        fontSize="xl"
        fontWeight="bold"
        minWidth={48}
        textShadow="0 0 5px rgba(0,0,0,0.1)"
        width={48}
      />
      <Box
        as="span"
        color={COLORS[variant][colorMode].color}
        dangerouslySetInnerHTML={{__html: message}}
        display="inline-flex"
        fontSize="xl"
        sx={{
          "& img": {
            width: 6,
            height: 6,
            marginX: 1,
            objectFit: "contain",
          },
        }}
      />
    </Stack>
  );
};

export default Message;
