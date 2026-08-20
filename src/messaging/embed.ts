import { EmbedBuilder } from "discord.js";

export function createEmbed(
  data: ConstructorParameters<typeof EmbedBuilder>[0] = {},
): EmbedBuilder {
  return new EmbedBuilder(data);
}
