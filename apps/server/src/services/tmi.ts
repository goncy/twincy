import * as tmi from "tmi.js";

import socket from "./socket";

import { parseBadges } from "~/utils/badges";
import { parseMessage } from "~/utils/message";

const client = new tmi.Client({
  channels: [],
});

client.on("message", (_channel, tags, _message) => {
  // Sanitize channel
  const channel = _channel.replace("#", "").toLowerCase();

  // Santize message
  const message = parseMessage(_message, tags["emotes"]);

  // Return if message is empty
  if (!message) return;

  // On twitch message, send message to admin
  socket.to(channel).emit("message", {
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

export default client;
