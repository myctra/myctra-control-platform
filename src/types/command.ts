import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface MyctraCommand {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
