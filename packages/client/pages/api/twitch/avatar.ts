import type {NextApiRequest, NextApiResponse} from "next";

type Request = NextApiRequest & {
  query: {
    user: string;
  };
};

export default async function handler(req: Request, res: NextApiResponse) {
  // Create request headers
  const headers = new Headers();

  // Set request headers
  headers.set("Client-Id", process.env.CLIENT_ID as string);
  headers.set("Authorization", `Bearer ${req.cookies["token"]}`);

  // Extract image
  const {
    data: [{profile_image_url: image}],
  } = await fetch(`https://api.twitch.tv/helix/users?login=${req.query.user}`, {
    headers,
  }).then((res) => res.json());

  // Fetch image
  const response = await fetch(image);

  // Cache it
  res.setHeader("content-type", response.headers.get("content-type") as string);
  res.setHeader("content-length", response.headers.get("content-length") as string);
  res.setHeader("etag", response.headers.get("etag") as string);
  res.setHeader("date", response.headers.get("date") as string);
  res.setHeader("cache-control", "public, immutable, max-age=31536000");

  // Return it
  return res.status(200).send(response.body);
}
