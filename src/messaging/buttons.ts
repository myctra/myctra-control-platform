import {
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export function createLinkButton(
  label: string,
  url: string,
): ButtonBuilder {
  return new ButtonBuilder()
    .setLabel(label)
    .setURL(url)
    .setStyle(ButtonStyle.Link);
}

export function createActionButton(
  customId: string,
  label: string,
  style: ButtonStyle = ButtonStyle.Primary,
): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style);
}
