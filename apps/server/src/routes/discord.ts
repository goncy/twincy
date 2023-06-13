import express from "express";

import { channelsAPI, guildsAPI } from "~/services/discord";

const discordRouter = express.Router();

discordRouter.get("/messages", async (req, res) => {
  const channelID = req.query.channel_id as string;
  const messages = await channelsAPI.getMessages(channelID, {limit: 100});
  const emoji = "✅";
  const lastMessageReacted = messages.find((message) =>
    message.reactions?.some((reaction) => reaction.emoji.name === emoji && reaction.me),
  );

  if (!lastMessageReacted) {
    res.status(404).json({success: false, msg: "No se encontró el último proyecto visto."});
    return;
  }

  const lastMessageIndex = messages.findIndex((message) =>
    message.reactions?.some((reaction) => reaction.emoji.name === emoji && reaction.me),
  );
  const messagesSinceLastReacted = messages.slice(0, lastMessageIndex);

  if (messagesSinceLastReacted.length === 0) {
    res.status(404).json({success: false, msg: "No se encontró el último proyecto visto."});
    return;
  }

  // Filter messages without links
  const regex = /(https?:\/\/[^\s]+)/;
  const possibleProjects = messagesSinceLastReacted
    .filter((message) => regex.test(message.content))
    .reverse();

  res.json({data: possibleProjects});
});

discordRouter.post("/messages/reaction/:id", async (req, res) => {
  const messageID = req.params.id;
  const {emoji, channel_id} = req.body;

  try {
    await channelsAPI.addMessageReaction(channel_id, messageID, emoji);
    res.json({success: true});
  } catch (e) {
    res.status(500).json({success: false, msg: "No se pudo reaccionar al mensaje."});
  }
});

discordRouter.delete("/messages/reaction/:id", async (req, res) => {
  const messageID = req.params.id;
  const {emoji, channel_id} = req.body;

  try {
    await channelsAPI.deleteOwnMessageReaction(channel_id, messageID, emoji);
    res.json({success: true});
  } catch (e) {
    res.status(500).json({success: false, msg: "No se pudo eliminar la reacción al mensaje."});
  }
});

discordRouter.get("/guilds", async (req, res) => {
  const guildID = req.query.guild_id as string;
  try {
    const resp = await guildsAPI.get(guildID);

    res.json(resp);
  } catch (e) {
    res.status(500).json({success: false, msg: "No se pudo obtener el detalle del servidor"});
  }
});

discordRouter.get("/guilds/channels", async (req, res) => {
  const guildID = req.query.guild_id as string;
  try {
    const resp = await guildsAPI.getChannels(guildID);

    res.json(resp);
  } catch (e) {
    res.status(500).json({success: false, msg: "No se pudieron obtener los canales del servidor"});
  }
});

export default discordRouter;
