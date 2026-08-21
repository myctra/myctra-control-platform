import "dotenv/config";
import { client } from "./core/client.js";
import { registerCommands } from "./commands/index.js";
import { registerEvents } from "./events/register.js";
import { validateEnvironment, env } from "./config/index.js";
import { initializeDatabase } from "./database/index.js";
import { startWebServer } from "./web/server.js";

async function start(): Promise<void> {
  validateEnvironment();
  await initializeDatabase();

  startWebServer(Number(process.env.PORT) || 3000);

  registerCommands();
  registerEvents(env.discordToken!);

  await client.login(env.discordToken!);
}

void start().catch((error) => {
  console.error("MYCTRA STARTUP ERROR:", error);
  process.exitCode = 1;
});
