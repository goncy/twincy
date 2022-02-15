import path from "path";

import reactRefresh from "@vitejs/plugin-react-refresh";
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ["socket.io-client"],
  },
  server: {
    port: 6600,
  },
  resolve: {
    alias: [
      {
        find: "socket.io-client",
        replacement: "socket.io-client/dist/socket.io.js",
      },
      {
        find: "~",
        replacement: path.resolve(path.resolve(__dirname), "src"),
      },
    ],
  },
});
