import type { Message, Review } from "@twincy/types";

import * as http from "http";

import * as SocketIO from "socket.io";

import client from "./tmi";

const io = new SocketIO.Server({
  cors: {
    origin: "*",
  },
});

export const initWSServer = (server: http.Server) => {
  io.attach(server);

  io.on("connection", async (socket) => {
    // Get the channel name from the socket
    const channel = (socket.handshake.query.channel as string)?.toLowerCase();

    // If no channel is provided, return
    if (!channel) {
      return socket.disconnect();
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

    // // VOTE

    socket.on("votation:start", async (options: string) => {
      //Only to self
      io.to(channel).emit("votation:start", options);
    });

    socket.on("votation:close", async () => {
      //Only to self
      io.to(channel).emit("votation:close");
    });

    socket.on("votation:end", async () => {
      //Only to self
      io.to(channel).emit("votation:end");
    });
  });
};

export default io;
