# myctra-control-platform
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  });

  console.log("MYCTRA BOT STARTING...");
  