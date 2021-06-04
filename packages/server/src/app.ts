import * as http from "http";
import * as path from "path";

import * as tmi from "tmi.js";
import * as SocketIO from "socket.io";
import * as express from "express";

import {CHANNEL} from "./constants";
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
  channels: [CHANNEL],
});

io.attach(server);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

io.on("connection", (socket) => {
  socket.on("select", (message: Message) => io.emit("select", message));
});

client.on("message", (_channel, tags, message) => {
  io.emit("message", {
    id: tags["id"],
    color: tags.color,
    sender: {
      badges: parseBadges(tags["badges"]),
      name: tags.username,
    },
    timestamp: Number(tags["tmi-sent-ts"]),
    message: parseMessage(message, tags["emotes"]),
    isHighlighted: tags["msg-id"] === "highlighted-message",
  });
});

app.get("/admin", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname + "/../../admin/dist")));

    res.sendFile("index.html", {root: path.resolve(__dirname + "/../../admin/dist")});
  } else {
    res.redirect("http://localhost:8002");
  }
});

app.get("/client", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname + "/../../client/dist")));

    res.sendFile(path.resolve(__dirname + "/../../client/dist/index.html"));
  } else {
    res.redirect("http://localhost:8001");
  }
});

server.listen(8000, () => {
  console.log(`Listening on port 8000`);

  client.connect();
});
