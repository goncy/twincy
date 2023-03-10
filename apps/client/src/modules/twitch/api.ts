const api = {
  token: {
    fetch: async (): Promise<{token: string; expires: Date}> => {
      const {access_token, expires_in} = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user_read`,
        {
          method: "POST",
        },
      ).then((res) => res.json());

      return {token: access_token, expires: new Date(Date.now() + expires_in * 1000)};
    },
  },
  avatar: {
    fetch: async (user: string, token: string) => {
      // Create request headers
      const headers = new Headers();

      // Set request headers
      headers.set("Client-Id", process.env.TWITCH_CLIENT_ID as string);
      headers.set("Authorization", `Bearer ${token}`);

      const {
        data: [{profile_image_url: image}],
      } = await fetch(`https://api.twitch.tv/helix/users?login=${user}`, {
        headers,
      }).then((res) => res.json());

      return image;
    },
  },
};

export default api;
