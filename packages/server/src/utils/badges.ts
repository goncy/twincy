import * as tmi from "tmi.js";

import {BADGES} from "../catalogs/badges";

export function parseBadges(badges: tmi.ChatUserstate["badges"] = {}) {
  return Object.entries(badges)
    .map(
      ([set, version = "0"]) =>
        BADGES[set as keyof tmi.ChatUserstate["badges"]]?.["versions"][version]?.["image_url_1x"],
    )
    .filter(Boolean);
}
