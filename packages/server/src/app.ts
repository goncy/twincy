import * as io from "socket.io";
import * as tmi from "tmi.js";

import {Message} from "./types";
import {parseMessage} from "./utils/message";

const server = new io.Server(8002, {
  cors: {
    origin: "*",
  },
});

const client = new tmi.Client({
  channels: ["goncypozzo"],
});

server.on("connection", (socket) => {
  socket.on("select", (message: Message) => server.emit("select", message));
});

client.on("message", (_channel, tags, message) => {
  server.emit("message", {
    id: tags["id"],
    color: tags.color,
    sender: tags.username,
    message: parseMessage(message, tags["emotes"]),
    isHighlighted: tags["msg-id"] === "highlighted-message",
  });
});

client.connect();
