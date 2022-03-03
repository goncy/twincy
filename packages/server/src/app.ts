import * as http from "http";

import * as tmi from "tmi.js";
import * as SocketIO from "socket.io";
import * as express from "express";

import {Message} from "./types";
import {parseMessage} from "./utils/message";
import {parseBadges} from "./utils/badges";

const app = express();
const server = new http.Server(app);
const io = new SocketIO.Server({
  cors: {
    origin: "*",
  },
});
const client = new tmi.Client({
  channels: [],
});

io.attach(server);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

io.on("connection", (socket) => {
  // Listen for changes on the selected message
  socket.on("select", (message: Message) => io.emit("select", message));

  // Listen for changes on the twitch channel
  socket.on("channel", async (channel: string) => {
    // Leave all channels
    client.getChannels().forEach(async (channel: string) => {
      await client.part(channel);
    });

    if (channel) {
      // Join new channel
      await client.join(channel);
    }

    // Emit change
    io.emit("channel", channel);
  });
});

client.on("message", (channel, tags, message) => {
  // On twitch message, send message to admin
  io.emit("message", {
    id: tags["id"],
    color: tags.color,
    channel: channel.replace("#", "").toLowerCase(),
    sender: {
      badges: parseBadges(tags["badges"]),
      name: tags.username,
    },
    tags,
    timestamp: Number(tags["tmi-sent-ts"]),
    message: parseMessage(message, tags["emotes"]),
  });
});

// Connect to the server
server.listen(6600, () => {
  // Connect to twitch
  client.connect();

  // Log connection
  console.log(`Listening on port 6600`);
});
