import express from "express";

import { channelsAPI } from "~/services/discord";

const discordRouter = express.Router();

discordRouter.get("/messages", async (req, res) => {
  const channelID = req.query.channel_id as string;
  const messages = await channelsAPI.getMessages(channelID, {limit: 100});
  const emoji = "✅";
  const lastMessageReacted = messages.find((message) =>
    message.reactions?.some((reaction) => reaction.emoji.name === emoji),
  );

  if (!lastMessageReacted) {
    res.status(404).json({success: false, msg: "No se encontró el último proyecto visto."});
    return;
  }

  const lastMessageIndex = messages.findIndex((message) =>
    message.reactions?.some((reaction) => reaction.emoji.name === emoji),
  );
  const usersReactions = await channelsAPI.getMessageReactions(
    channelID,
    lastMessageReacted.id,
    emoji,
    {limit: 100},
  );
  const botID = "826273567141396490";
  const botHasReacted = usersReactions.some((user) => user.id === botID);

  if (!botHasReacted) {
    res.status(404).json({success: false, msg: "No se encontró el último proyecto visto."});
    return;
  }

  const messagesSinceLastReacted = messages.slice(0, lastMessageIndex);
  // Filter messages without links
  const regex = /(https?:\/\/[^\s]+)/;
  const possibleProjects = messagesSinceLastReacted
    .filter((message) => regex.test(message.content))
    .reverse();

  res.json({data: possibleProjects});
});

discordRouter.post("/messages/:id", async (req, res) => {
  const messageID = req.params.id;
  const {emoji, channel_id} = req.body;

  try {
    await channelsAPI.addMessageReaction(channel_id, messageID, emoji);
    res.json({success: true});
  } catch (e) {
    res.status(500).json({success: false, msg: "No se pudo reaccionar al mensaje."});
  }
});

discordRouter.delete("/messages/:id", async (req, res) => {
  const messageID = req.params.id;
  const {emoji, channel_id} = req.body;

  try {
    await channelsAPI.deleteOwnMessageReaction(channel_id, messageID, emoji);
    res.json({success: true});
  } catch (e) {
    res.status(500).json({success: false, msg: "No se pudo eliminar la reacción al mensaje."});
  }
});

export default discordRouter;
