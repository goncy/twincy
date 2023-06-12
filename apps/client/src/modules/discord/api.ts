import axios from "axios";
import { type APIChannel, type APIGuild, type APIMessage } from "discord-api-types/v10";

const api = {
  messages: {
    fetch: async (channelID: APIChannel["id"]): Promise<APIMessage[]> => {
      const url = `http://localhost:6600/api/discord/messages?channel_id=${channelID}`;
      const res = await axios.get(url);

      return res.data.data;
    },
    addReaction: async (
      channelID: APIChannel["id"],
      messageID: APIMessage["id"],
      emoji: string,
    ) => {
      const url = `http://localhost:6600/api/discord/messages/reaction/${messageID}`;
      const data = {emoji, channel_id: channelID};

      return axios.post(url, data);
    },
    deleteReaction: async (
      channelID: APIChannel["id"],
      messageID: APIMessage["id"],
      emoji: string,
    ) => {
      const url = `http://localhost:6600/api/discord/messages/reaction/${messageID}`;
      const data = {emoji, channel_id: channelID};

      return axios.delete(url, {data});
    },
  },
  guild: {
    fetch: async (guildID: APIGuild["id"]): Promise<APIGuild> => {
      const url = `http://localhost:6600/api/discord/guilds?guild_id=${guildID}`;
      const res = await axios.get(url);

      return res.data;
    },
    fetchChannels: async (guildID: APIGuild["id"]): Promise<APIChannel[]> => {
      const url = `http://localhost:6600/api/discord/guilds/channels?guild_id=${guildID}`;
      const res = await axios.get(url);

      return res.data;
    },
  },
};

export default api;
