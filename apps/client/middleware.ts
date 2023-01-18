import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

export const matchers = ["/api/twitch/*"];

// This handler adds the twitch token requests
export default async function handler(req: NextRequest) {
  let response = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/twitch") && !req.cookies.get("token")) {
    const {access_token} = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials&scope=user_read`,
      {
        method: "POST",
      },
    ).then((res) => res.json());

    response.cookies.set("token", access_token);
  }

  return response;
}
