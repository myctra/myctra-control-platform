import "dotenv/config";
import { client } from "./core/client.js";
import { registerCommands } from "./commands/index.js";
import { registerEvents } from "./events/register.js";

registerCommands();
registerEvents();

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN is missing from .env");
}

client.login(token);
