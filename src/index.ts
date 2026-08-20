import "dotenv/config";
import { client } from "./core/client.js";
import { registerCommands } from "./commands/index.js";
import { registerEvents } from "./events/register.js";
import { validateEnvironment, env } from "./config/index.js";

validateEnvironment();
registerCommands();
registerEvents(env.discordToken!);

client.login(env.discordToken!);
