import type { ChatInputCommandInteraction } from "discord.js";
import { getCommand } from "./registry.js";

export async function handleCommand(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const command = getCommand(interaction.commandName);

  if (!command) {
    await interaction.reply({
      content: "MYCTRA: Command not found.",
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(
      `MYCTRA COMMAND ERROR [${interaction.commandName}]:`,
      error,
    );

    const message = "حدث خطأ أثناء تنفيذ الأمر.";

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: message,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: message,
        ephemeral: true,
      });
    }
  }
}
