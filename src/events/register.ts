import { client } from "../core/client.js";
import { handleCommand } from "../commands/handler.js";

export function registerEvents(): void {
  client.once("clientReady", (bot) => {
    console.log(`MYCTRA ONLINE: ${bot.user.tag}`);
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
