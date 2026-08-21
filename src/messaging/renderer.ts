import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ContainerBuilder,
    EmbedBuilder,
    MentionableSelectMenuBuilder,
    MessageFlags,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    RoleSelectMenuBuilder,
    SeparatorBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
    UserSelectMenuBuilder,
} from "discord.js";
import type {
    MyctraElement,
    MyctraMessageDocument,
    MyctraButton,
    MyctraSelect,
} from "./schema.js";

type AnySelect =
    | StringSelectMenuBuilder
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | MentionableSelectMenuBuilder;

export function renderMessage(document: MyctraMessageDocument) {
    return {
        content: document.content,
        components: document.elements
            .filter((element) => element.type === "container")
            .map(renderContainer),
        embeds: document.elements
            .filter((element) => element.type === "embed")
            .map(renderEmbed),
        flags: MessageFlags.IsComponentsV2,
    };
}

function renderContainer(element: MyctraElement) {
    const container = new ContainerBuilder();
    const buttons: ButtonBuilder[] = [];

    for (const child of element.children ?? []) {
        if (child.type === "text" && child.text) {
            flushButtons(container, buttons);
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(child.text.content),
            );
        } else if (child.type === "separator") {
            flushButtons(container, buttons);
            container.addSeparatorComponents(new SeparatorBuilder());
        } else if (child.type === "image" && child.image) {
            flushButtons(container, buttons);
            container.addMediaGalleryComponents(
                new MediaGalleryBuilder().addItems(
                    new MediaGalleryItemBuilder().setURL(child.image.url),
                ),
            );
        } else if (child.type === "button" && child.button) {
            buttons.push(renderButton(child.button));
        } else if (child.type === "select" && child.select) {
            flushButtons(container, buttons);

            const select = renderSelect(child.select);

            container.addActionRowComponents(
                new ActionRowBuilder<AnySelect>().addComponents(select),
            );
        }
    }

    flushButtons(container, buttons);

    return container;
}

function flushButtons(
    container: ContainerBuilder,
    buttons: ButtonBuilder[],
) {
    if (buttons.length === 0) {
        return;
    }

    container.addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons),
    );

    buttons.length = 0;
}

function renderButton(data: MyctraButton) {
    const button = new ButtonBuilder()
        .setLabel(data.label)
        .setStyle(buttonStyle(data.style));

    if (data.style === "link") {
        if (!data.url) {
            throw new Error("Link buttons require a URL.");
        }

        button.setURL(data.url);
    } else {
        if (!data.customId) {
            throw new Error("Action buttons require a custom ID.");
        }

        button.setCustomId(data.customId);
    }

    return button;
}

function buttonStyle(style: MyctraButton["style"]) {
    switch (style) {
        case "secondary":
            return ButtonStyle.Secondary;
        case "success":
            return ButtonStyle.Success;
        case "danger":
            return ButtonStyle.Danger;
        case "link":
            return ButtonStyle.Link;
        default:
            return ButtonStyle.Primary;
    }
}

function renderSelect(data: MyctraSelect): AnySelect {
    if (data.type === "role") {
        return configureSelect(
            new RoleSelectMenuBuilder().setCustomId(data.customId),
            data,
        );
    }

    if (data.type === "channel") {
        return configureSelect(
            new ChannelSelectMenuBuilder().setCustomId(data.customId),
            data,
        );
    }

    if (data.type === "user") {
        return configureSelect(
            new UserSelectMenuBuilder().setCustomId(data.customId),
            data,
        );
    }

    if (data.type === "mentionable") {
        return configureSelect(
            new MentionableSelectMenuBuilder().setCustomId(data.customId),
            data,
        );
    }

    return configureSelect(
        new StringSelectMenuBuilder().setCustomId(data.customId),
        data,
    );
}

function configureSelect<T extends AnySelect>(
    menu: T,
    data: MyctraSelect,
): T {
    if (data.placeholder) {
        menu.setPlaceholder(data.placeholder);
    }

    if (data.minValues !== undefined) {
        menu.setMinValues(data.minValues);
    }

    if (data.maxValues !== undefined) {
        menu.setMaxValues(data.maxValues);
    }

    return menu;
}

function renderEmbed(element: MyctraElement) {
    const data = element.embed;
    const embed = new EmbedBuilder();

    if (!data) {
        return embed;
    }

    if (data.title) {
        embed.setTitle(data.title);
    }

    if (data.description) {
        embed.setDescription(data.description);
    }

    if (data.url) {
        embed.setURL(data.url);
    }

    if (data.color !== undefined) {
        embed.setColor(data.color);
    }

    if (data.author) {
        embed.setAuthor({ name: data.author });
    }

    if (data.thumbnail?.url) {
        embed.setThumbnail(data.thumbnail.url);
    }

    if (data.image?.url) {
        embed.setImage(data.image.url);
    }

    if (data.fields?.length) {
        embed.addFields(
            data.fields.map((field) => ({
                name: field.name,
                value: field.value,
                inline: field.inline,
            })),
        );
    }

    if (data.footer) {
        embed.setFooter({ text: data.footer });
    }

    return embed;
}
