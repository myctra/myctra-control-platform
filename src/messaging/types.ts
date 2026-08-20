import type {
  APIEmbed,
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export type MyctraEmbed = APIEmbed | EmbedBuilder;

export type MyctraButton = ButtonBuilder;

export type MyctraSelectMenu = StringSelectMenuBuilder;

export type MyctraComponentRow =
  | ActionRowBuilder<ButtonBuilder>
  | ActionRowBuilder<StringSelectMenuBuilder>;

export interface MyctraMessage {
  content?: string;
  embeds?: MyctraEmbed[];
  components?: MyctraComponentRow[];
}
