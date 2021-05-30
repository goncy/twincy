import {extendTheme, theme} from "@chakra-ui/react";
import {mode} from "@chakra-ui/theme-tools";

export default extendTheme({
  colors: {
    secondary: {
      ...theme.colors.yellow,
      500: "#EAD30A",
    },
    primary: {
      ...theme.colors.purple,
      500: "#5C16C5",
    },
    dark: {
      900: "#181818",
      800: "#1F1F23",
      700: "#222226",
    },
    light: {
      100: "#f9f9f9",
      200: "#F5F5F5",
    },
  },
  fonts: {
    body: "Roboto, sans-serif",
    heading: "Roboto, sans-serif",
    mono: "Menlo, monospace",
  },
  styles: {
    global: (props) => ({
      "html, body, #root": {
        height: "100%",
        maxHeight: "100vh",
        backgroundColor: mode("light.200", "dark.900")(props),
      },
    }),
  },
  layerStyles: {
    card: {
      ".chakra-ui-light &": {
        backgroundColor: "white",
        _hover: {
          backgroundColor: "light.100",
        },
      },
      ".chakra-ui-dark &": {
        backgroundColor: "dark.800",
        _hover: {
          backgroundColor: "dark.700",
        },
      },
    },
    alert: {
      backgroundColor: "primary.500",
    },
  },
  textStyles: {
    white: {
      color: "white",
    },
    primary: {
      "&": {
        color: "primary.500",
      },
    },
    secondary: {
      "&": {
        color: "secondary.500",
      },
    },
    translucid: {
      ".chakra-ui-light &": {
        color: "blackAlpha.100",
      },
      ".chakra-ui-dark &": {
        color: "whiteAlpha.100",
      },
    },
    title: {
      ".chakra-ui-light &": {
        color: "black",
      },
      ".chakra-ui-dark &": {
        color: "white",
      },
    },
    soft: {
      ".chakra-ui-light &": {
        color: "blackAlpha.800",
      },
      ".chakra-ui-dark &": {
        color: "whiteAlpha.800",
      },
    },
  },
});
