import { client } from "../core/client.js";
import { handleCommand } from "../commands/handler.js";
import { deployCommands } from "../commands/deployer.js";

export function registerEvents(token: string): void {
  client.once("clientReady", async (bot) => {
    console.log(`MYCTRA ONLINE: ${bot.user.tag}`);

    try {
      await deployCommands(token, bot.user.id);
    } catch (error) {
      console.error("MYCTRA COMMAND DEPLOYMENT ERROR:", error);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    await handleCommand(interaction);
  });

  client.on("error", (error) => {
    console.error("MYCTRA DISCORD ERROR:", error);
  });

  client.on("warn", (message) => {
    console.warn("MYCTRA DISCORD WARNING:", message);
  });
}
