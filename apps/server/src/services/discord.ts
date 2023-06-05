import { ChannelsAPI, GuildsAPI, OAuth2API } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import "dotenv/config.js";

const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN || "");
export const channelsAPI = new ChannelsAPI(rest);
export const guildsAPI = new GuildsAPI(rest);
export const oAuth2API = new OAuth2API(rest);
