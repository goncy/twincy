import {extendTheme} from "@chakra-ui/react";

export default extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
        maxHeight: "100vh",
      },
    },
  },
});
