import * as http from "http";
import * as path from "path";

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
  // Store the draft message
  let text = message;

  // Check if the message is a question
  const isQuestion = text.startsWith("!q ");

  // Check if user bought a prize
  const isPrize = tags["msg-id"] === "highlighted-message";

  // Check if the user tagged you
  const isTag = message.toLowerCase().includes(channel.replace("#", "").toLowerCase());

  // If is a question, strip the command
  if (isQuestion) {
    text = text.replace("!q ", "");
  }

  // On twitch message, send message to admin
  io.emit("message", {
    id: tags["id"],
    color: tags.color,
    sender: {
      badges: parseBadges(tags["badges"]),
      name: tags.username,
    },
    timestamp: Number(tags["tmi-sent-ts"]),
    message: parseMessage(text, tags["emotes"]),
    isHighlighted: isQuestion || isPrize || isTag,
  });
});

// Send the admin panel, used by electron
app.get("/admin", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname + "/../../admin/dist")));

    res.sendFile("index.html", {root: path.resolve(__dirname + "/../../admin/dist")});
  } else {
    res.redirect("http://localhost:6602");
  }
});

// Send the client, used by electron
app.get("/client", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname + "/../../client/dist")));

    res.sendFile(path.resolve(__dirname + "/../../client/dist/index.html"));
  } else {
    res.redirect("http://localhost:6601");
  }
});

// Connect to the server
server.listen(6600, () => {
  // Connect to twitch
  client.connect();

  // Log connection
  console.log(`Listening on port 6600`);
});
