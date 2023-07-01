import {NextRequest} from "next/server";

import api from "@/twitch/api";

// Use edge
export const runtime = "edge";

interface Cookie {
  token: string | undefined;
  expires: Date | null;
}

export async function GET(req: NextRequest) {
  // Get user from url
  const {searchParams} = new URL(req.url);
  const user = searchParams.get("user") as string;
  // Set partial cookie
  let cookie: Cookie = {
    token: req.cookies.get("token")?.value,
    expires: null,
  };

  // Get token if not present
  if (!cookie.token) {
    const {token, expires} = await api.token.fetch();

    cookie = {token, expires};
  }

  // Extract image
  const image = await api.avatar.fetch(user, cookie.token as string);

  // Return image
  const blob = await fetch(image);

  // Set token cookie
  if (cookie.token && cookie.expires) {
    blob.headers.set("Set-Cookie", `token=${cookie.token}; expires=${cookie.expires};`);
  }

  // Return blob
  return blob;
}
