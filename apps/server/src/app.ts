import server from "./services/server";
import client from "./services/tmi";

async function main() {
  // Connect to twitch
  await client.connect();

  // Connect to the server
  await server.listen(6600);

  // Log ready status
  console.log(`Listening on port 6600 🚀`);
}

// Execute main function
main();
