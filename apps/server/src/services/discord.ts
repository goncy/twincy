import { ChannelsAPI, GuildsAPI } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import "dotenv/config.js";

const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN || "");
export const channelsAPI = new ChannelsAPI(rest);
export const guildsAPI = new GuildsAPI(rest);
