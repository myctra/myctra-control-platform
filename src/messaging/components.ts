import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
} from "discord.js";

export type SelectKind =
    | "string"
    | "user"
    | "role"
    | "channel"
    | "mentionable";

export interface SelectOption {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}

export interface SelectConfig {
    type: SelectKind;
    customId: string;
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    options?: SelectOption[];
}

export function createButton(
    label: string,
    style: ButtonStyle,
    customId?: string,
    url?: string,
) {
    const button = new ButtonBuilder()
        .setLabel(label)
        .setStyle(style);

    if (style === ButtonStyle.Link) {
        if (!url) {
            throw new Error("Link buttons require a URL.");
        }
        button.setURL(url);
    } else {
        if (!customId) {
            throw new Error("Action buttons require a custom ID.");
        }
        button.setCustomId(customId);
    }

    return button;
}

export function createSelect(config: SelectConfig) {
    if (config.type === "role") {
        return configureSelect(
            new RoleSelectMenuBuilder().setCustomId(config.customId),
            config,
        );
    }

    if (config.type === "channel") {
        return configureSelect(
            new ChannelSelectMenuBuilder().setCustomId(config.customId),
            config,
        );
    }

    if (config.type === "user") {
        return configureSelect(
            new UserSelectMenuBuilder().setCustomId(config.customId),
            config,
        );
    }

    if (config.type === "mentionable") {
        return configureSelect(
            new MentionableSelectMenuBuilder().setCustomId(config.customId),
            config,
        );
    }

    const menu = new StringSelectMenuBuilder()
        .setCustomId(config.customId);

    if (config.options?.length) {
        menu.addOptions(config.options);
    }

    return configureSelect(menu, config);
}

function configureSelect<T extends
    | StringSelectMenuBuilder
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | MentionableSelectMenuBuilder>(
    menu: T,
    config: SelectConfig,
): T {
    if (config.placeholder) {
        menu.setPlaceholder(config.placeholder);
    }

    if (config.minValues !== undefined) {
        menu.setMinValues(config.minValues);
    }

    if (config.maxValues !== undefined) {
        menu.setMaxValues(config.maxValues);
    }

    return menu;
}

export function buttonRow(...buttons: ButtonBuilder[]) {
    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(buttons);
}

export function selectRow(
    select:
        | StringSelectMenuBuilder
        | UserSelectMenuBuilder
        | RoleSelectMenuBuilder
        | ChannelSelectMenuBuilder
        | MentionableSelectMenuBuilder,
) {
    return new ActionRowBuilder<typeof select>()
        .addComponents(select);
}
