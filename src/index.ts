import "dotenv/config";
import { client } from "./core/client.js";

client.once("clientReady", (bot) => {
  console.log(`MYCTRA ONLINE: ${bot.user.tag}`);
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN is missing from .env");
}

client.login(token);
