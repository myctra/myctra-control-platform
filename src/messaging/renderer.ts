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
    SectionBuilder,
    SeparatorBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder,
    UserSelectMenuBuilder,
} from "discord.js";

import type {
    MyctraAccessory,
    MyctraButton,
    MyctraElement,
    MyctraMessageDocument,
    MyctraSelect,
} from "./schema.js";

type AnySelect =
    | StringSelectMenuBuilder
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | MentionableSelectMenuBuilder;

export function renderMessage(document: MyctraMessageDocument) {
    const components = document.elements
        .filter((element) => element.type !== "embed")
        .map(renderElement);

    const embeds = document.elements
        .filter((element) => element.type === "embed")
        .map(renderEmbed);

    return {
        content: document.content,
        components,
        embeds,
        flags: MessageFlags.IsComponentsV2,
    };
}

function renderElement(element: MyctraElement) {
    switch (element.type) {
        case "container":
            return renderContainer(element);

        case "text":
            return renderText(element);

        case "image":
            return renderImage(element);

        case "separator":
            return new SeparatorBuilder();

        case "button":
            return renderButtonRow(element);

        case "select":
            return renderSelectRow(element);

        case "section":
            return renderSection(element);

        case "embed":
            return renderEmbed(element);

        default:
            throw new Error(
                `Unsupported message element: ${element.type}`,
            );
    }
}

function renderContainer(element: MyctraElement) {
    const container = new ContainerBuilder();

    /*
     * children[] is the user's real message layout.
     *
     * There is NO fixed pattern.
     *
     * Example:
     * image -> text -> select -> image -> button -> text
     *
     * Another message can be:
     * text -> image -> image -> button -> select
     *
     * The renderer preserves the stored order.
     */

    for (const child of element.children ?? []) {
        switch (child.type) {
            case "text":
                if (child.text) {
                    container.addTextDisplayComponents(
                        renderText(child),
                    );
                }
                break;

            case "image":
                if (child.image?.url) {
                    container.addMediaGalleryComponents(
                        renderImage(child),
                    );
                }
                break;

            case "separator":
                container.addSeparatorComponents(
                    new SeparatorBuilder(),
                );
                break;

            case "button":
                if (child.button) {
                    container.addActionRowComponents(
                        renderButtonRow(child),
                    );
                }
                break;

            case "select":
                if (child.select) {
                    container.addActionRowComponents(
                        renderSelectRow(child),
                    );
                }
                break;

            case "section":
                container.addSectionComponents(
                    renderSection(child),
                );
                break;

            case "embed":
                /*
                 * Classic embeds are not children of a
                 * Components V2 container. They are rendered
                 * separately by renderMessage().
                 */
                break;

            case "container":
                /*
                 * Discord.js does not expose nested
                 * ContainerBuilder support here.
                 *
                 * The parent container is already the
                 * free-form element canvas.
                 */
                break;

            default:
                throw new Error(
                    `Unsupported child element: ${child.type}`,
                );
        }
    }

    return container;
}

function renderText(element: MyctraElement) {
    if (!element.text) {
        throw new Error(
            "Text element requires text data.",
        );
    }

    return new TextDisplayBuilder().setContent(
        element.text.content,
    );
}

function renderImage(element: MyctraElement) {
    if (!element.image?.url) {
        throw new Error(
            "Image element requires an image URL.",
        );
    }

    return new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL(
            element.image.url,
        ),
    );
}

function renderButtonRow(element: MyctraElement) {
    if (!element.button) {
        throw new Error(
            "Button element requires button data.",
        );
    }

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        renderButton(element.button),
    );
}

function renderButton(data: MyctraButton) {
    const button = new ButtonBuilder()
        .setLabel(data.label)
        .setStyle(getButtonStyle(data.style));

    if (data.emoji) {
        button.setEmoji(data.emoji);
    }

    if (data.disabled !== undefined) {
        button.setDisabled(data.disabled);
    }

    if (data.style === "link") {
        if (!data.url) {
            throw new Error(
                "Link button requires a URL.",
            );
        }

        button.setURL(data.url);
    } else {
        if (!data.customId) {
            throw new Error(
                "Non-link button requires a custom ID.",
            );
        }

        button.setCustomId(data.customId);
    }

    return button;
}

function getButtonStyle(
    style: MyctraButton["style"],
) {
    switch (style) {
        case "secondary":
            return ButtonStyle.Secondary;

        case "success":
            return ButtonStyle.Success;

        case "danger":
            return ButtonStyle.Danger;

        case "link":
            return ButtonStyle.Link;

        case "primary":
        default:
            return ButtonStyle.Primary;
    }
}

function renderSelectRow(element: MyctraElement) {
    if (!element.select) {
        throw new Error(
            "Select element requires select data.",
        );
    }

    return new ActionRowBuilder<AnySelect>().addComponents(
        renderSelect(element.select),
    );
}

function renderSelect(
    data: MyctraSelect,
): AnySelect {
    if (data.type === "string") {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(data.customId);

        if (data.options?.length) {
            menu.addOptions(
                data.options.map((option) => ({
                    label: option.label,
                    value: option.value,
                    description: option.description,
                    emoji: option.emoji,
                    default: option.default,
                })),
            );
        }

        return configureSelect(menu, data);
    }

    if (data.type === "user") {
        return configureSelect(
            new UserSelectMenuBuilder()
                .setCustomId(data.customId),
            data,
        );
    }

    if (data.type === "role") {
        return configureSelect(
            new RoleSelectMenuBuilder()
                .setCustomId(data.customId),
            data,
        );
    }

    if (data.type === "channel") {
        return configureSelect(
            new ChannelSelectMenuBuilder()
                .setCustomId(data.customId),
            data,
        );
    }

    return configureSelect(
        new MentionableSelectMenuBuilder()
            .setCustomId(data.customId),
        data,
    );
}

function configureSelect<T extends AnySelect>(
    menu: T,
    data: MyctraSelect,
): T {
    if (data.placeholder) {
        menu.setPlaceholder(
            data.placeholder,
        );
    }

    if (data.minValues !== undefined) {
        menu.setMinValues(
            data.minValues,
        );
    }

    if (data.maxValues !== undefined) {
        menu.setMaxValues(
            data.maxValues,
        );
    }

    if (data.disabled !== undefined) {
        menu.setDisabled(
            data.disabled,
        );
    }

    return menu;
}

function renderSection(element: MyctraElement) {
    if (!element.section) {
        throw new Error(
            "Section element requires section data.",
        );
    }

    const section = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                element.section.text.content,
            ),
        );

    const accessory = element.section.accessory;

    if (!accessory) {
        return section;
    }

    addAccessory(
        section,
        accessory,
    );

    return section;
}

function addAccessory(
    section: SectionBuilder,
    accessory: MyctraAccessory,
) {
    if (accessory.type === "button") {
        if (!accessory.button) {
            throw new Error(
                "Button accessory requires button data.",
            );
        }

        section.setButtonAccessory(
            renderButton(
                accessory.button,
            ),
        );

        return;
    }

    if (!accessory.image?.url) {
        throw new Error(
            "Image accessory requires an image URL.",
        );
    }

    section.setThumbnailAccessory(
        new ThumbnailBuilder().setURL(
            accessory.image.url,
        ),
    );
}

function renderEmbed(element: MyctraElement) {
    const embed = new EmbedBuilder();
    const data = element.embed;

    if (!data) {
        return embed;
    }

    if (data.title) {
        embed.setTitle(
            data.title,
        );
    }

    if (data.description) {
        embed.setDescription(
            data.description,
        );
    }

    if (data.url) {
        embed.setURL(
            data.url,
        );
    }

    if (data.color !== undefined) {
        embed.setColor(
            data.color,
        );
    }

    if (data.author) {
        embed.setAuthor({
            name: data.author,
        });
    }

    if (data.thumbnail?.url) {
        embed.setThumbnail(
            data.thumbnail.url,
        );
    }

    if (data.image?.url) {
        embed.setImage(
            data.image.url,
        );
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
        embed.setFooter({
            text: data.footer,
        });
    }

    return embed;
}
