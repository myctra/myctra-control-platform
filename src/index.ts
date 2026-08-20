import "dotenv/config";
import { client } from "./core/client.js";
import { registerCommands } from "./commands/index.js";
import { registerEvents } from "./events/register.js";
import { validateEnvironment, env } from "./config/index.js";
import { initializeDatabase } from "./database/index.js";

async function start(): Promise<void> {
  validateEnvironment();
  await initializeDatabase();

  registerCommands();
  registerEvents(env.discordToken!);

  await client.login(env.discordToken!);
}

void start().catch((error) => {
  console.error("MYCTRA STARTUP ERROR:", error);
  process.exitCode = 1;
});
