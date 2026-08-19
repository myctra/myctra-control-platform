import { SlashCommandBuilder } from "discord.js";
import type { MyctraCommand } from "../types/command.js";

export const pingCommand: MyctraCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check MYCTRA response status."),

  async execute(interaction) {
    await interaction.reply("MYCTRA Pong!");
  },
};
