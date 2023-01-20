import type {Message, Review} from "@twincy/types";

import * as http from "http";

import * as tmi from "tmi.js";
import * as SocketIO from "socket.io";
import express from "express";

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

io.on("connection", async (socket) => {
  // Get the channel name from the socket
  const channel = (socket.handshake.query.channel as string)?.toLowerCase();

  // If no channel is provided, return
  if (!channel) {
    return;
  }

  // Join the socket to the channel
  await socket.join(channel);

  //Check if the channel is in the list of channels
  if (!client.getChannels().includes(`#${channel}`)) {
    try {
      // Join channel
      await client.join(channel);
    } catch (error) {
      // If you are already joined, TMI will throw an error
      console.warn(error, "You are probably joined to this channel already");
    }
  }

  socket.on("disconnect", async () => {
    // Get sockets connected to the channel
    const sockets = await io.in(channel).fetchSockets();

    // If no sockets are connected, part from channel
    if (sockets.length === 0 && client.getChannels().includes(`#${channel}`)) {
      try {
        // Part channel
        await client.part(`#${channel}`);
      } catch (error) {
        // If you are already disconnected, TMI will throw an error
        console.warn("You are probably disconnected from this channel already");
      }
    }
  });

  // Apps related messages
  // // MESSAGES

  // Listen for changes on the selected message
  socket.on("messages:select", async (message: Message) => {
    // Only to self
    io.to(channel).emit("messages:select", message);
  });

  // // REVIEW

  // Listen for changes on a single review
  socket.on("review:update", async (review: Review) => {
    // Only to self
    io.to(channel).emit("review:update", review);
  });

  // Listen for changes on all review
  socket.on("review:replace", async (reviews: Review[]) => {
    // Only to self
    io.to(channel).emit("review:replace", reviews);
  });
});

client.on("message", (_channel, tags, _message) => {
  // Sanitize channel
  const channel = _channel.replace("#", "").toLowerCase();

  // Santize message
  const message = parseMessage(_message, tags["emotes"]);

  // Return if message is empty
  if (!message) return;

  // On twitch message, send message to admin
  io.to(channel).emit("message", {
    id: tags["id"],
    color: tags.color,
    channel,
    sender: {
      badges: parseBadges(tags["badges"]),
      name: tags.username,
    },
    tags,
    timestamp: Number(tags["tmi-sent-ts"]),
    message,
  });
});

async function main() {
  // Connect to twitch
  await client.connect();

  // Connect to the server
  await server.listen(6600);

  // Log ready status
  console.log(`Listening on port 6600 🚀`);
}

// Execute main function
main();
