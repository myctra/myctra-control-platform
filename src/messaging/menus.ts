import { StringSelectMenuBuilder } from "discord.js";

export interface MyctraSelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
  default?: boolean;
}

export function createSelectMenu(
  customId: string,
  placeholder: string,
  options: MyctraSelectOption[],
): StringSelectMenuBuilder {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .addOptions(
      options.map((option) => ({
        label: option.label,
        value: option.value,
        ...(option.description
          ? { description: option.description }
          : {}),
        ...(option.emoji ? { emoji: option.emoji } : {}),
        ...(option.default !== undefined
          ? { default: option.default }
          : {}),
      })),
    );

  return menu;
}
