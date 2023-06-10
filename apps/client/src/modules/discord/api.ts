import axios from "axios";

import { Channel, DiscordMessage, Guild } from "./interface";

const api = {
  messages: {
    fetch: async (channelID: Channel["id"]): Promise<DiscordMessage[]> => {
      const url = `http://localhost:6600/api/discord/messages?channel_id=${channelID}`;
      const res = await axios.get(url);

      return res.data.data;
    },
    addReaction: async (
      channelID: Channel["id"],
      messageID: DiscordMessage["id"],
      emoji: string,
    ) => {
      const url = `http://localhost:6600/api/discord/messages/reaction/${messageID}`;
      const data = {emoji, channel_id: channelID};

      return axios.post(url, data);
    },
    deleteReaction: async (
      channelID: Channel["id"],
      messageID: DiscordMessage["id"],
      emoji: string,
    ) => {
      const url = `http://localhost:6600/api/discord/messages/reaction/${messageID}`;
      const data = {emoji, channel_id: channelID};

      return axios.delete(url, {data});
    },
  },
  guild: {
    fetch: async (guildID: Guild["id"]): Promise<Guild> => {
      const url = `http://localhost:6600/api/discord/guilds?guild_id=${guildID}`;
      const res = await axios.get(url);

      return res.data;
    },
    fetchChannels: async (guildID: Guild["id"]): Promise<Channel[]> => {
      const url = `http://localhost:6600/api/discord/guilds/channels?guild_id=${guildID}`;
      const res = await axios.get(url);

      return res.data;
    },
  },
};

export default api;
