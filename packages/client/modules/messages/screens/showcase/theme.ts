import {extendTheme, theme} from "@chakra-ui/react";

export default extendTheme({
  colors: {
    primary: {
      ...theme.colors.purple,
      500: "#5C16C5",
    },
  },
  fonts: {
    body: "Roboto, sans-serif",
    heading: "Roboto, sans-serif",
    mono: "Menlo, monospace",
  },
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
        maxHeight: "100vh",
        overflow: "hidden",
      },
      "#__next": {
        height: "100%",
        maxHeight: "100vh",
        padding: "2rem",
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
      },
    },
  },
});
