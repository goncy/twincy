import {extendTheme, theme} from "@chakra-ui/react";

export default extendTheme({
  config: {
    initialColorMode: "dark",
  },
  colors: {
    primary: {
      ...theme.colors.purple,
      500: "#5C16C5",
    },
    secondary: {
      ...theme.colors.yellow,
      500: "#EAD30A",
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
    body: "var(--font-roboto), sans-serif",
    heading: "var(--font-roboto), sans-serif",
    mono: "Menlo, monospace",
    inter: "var(--font-inter), 'Inter', sans-serif",
    pressStart: "var(--font-press-start), 'Press Start 2P', cursive",
  },
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
        maxHeight: "100vh",
        overflow: "hidden",
      },
      body: {
        transition: "background 0",
        backgroundColor: "transparent",
      },
    },
  },
  semanticTokens: {
    colors: {
      background: {
        default: "light.200",
        _dark: "dark.900",
      },
      primary: "primary.500",
      secondary: "secondary.500",
      content: {
        default: "white",
        _dark: "dark.800",
      },
      solid: {
        default: "black",
        _dark: "white",
      },
      soft: {
        default: "blackAlpha.800",
        _dark: "whiteAlpha.800",
      },
      translucid: {
        default: "blackAlpha.200",
        _dark: "whiteAlpha.200",
      },
    },
  },
});
