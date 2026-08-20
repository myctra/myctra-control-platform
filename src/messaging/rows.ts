import {
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export function buttonRow(
  ...buttons: ButtonBuilder[]
): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);
}

export function selectRow(
  menu: StringSelectMenuBuilder,
): ActionRowBuilder<StringSelectMenuBuilder> {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}
