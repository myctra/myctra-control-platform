import {
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
} from "discord.js";

import type {
    MyctraElement,
    MyctraMessageDocument,
} from "./schema.js";

export function renderMessage(document: MyctraMessageDocument) {
    return {
        content: document.content,
        components: document.elements
            .filter((element) => element.type === "container")
            .map(renderContainer),
        embeds: document.elements
            .filter((element) => element.type === "embed")
            .map((element) => renderEmbed(element)),
        flags: MessageFlags.IsComponentsV2,
    };
}

function renderEmbed(element: MyctraElement) {
    const data = element.embed;

    if (!data) {
        return new EmbedBuilder();
    }

    const embed = new EmbedBuilder();

    if (data.title) embed.setTitle(data.title);
    if (data.description) embed.setDescription(data.description);
    if (data.url) embed.setURL(data.url);
    if (data.color !== undefined) embed.setColor(data.color);

    if (data.footer) {
        embed.setFooter({ text: data.footer });
    }

    if (data.fields?.length) {
        embed.addFields(data.fields);
    }

    return embed;
}

function renderContainer(element: MyctraElement) {
    const container = new ContainerBuilder();

    for (const child of element.children ?? []) {
        if (child.type === "text" && child.text) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(child.text.content),
            );
        }

        if (child.type === "separator") {
            container.addSeparatorComponents(
                new SeparatorBuilder(),
            );
        }

        if (child.type === "image" && child.image) {
            const item = new MediaGalleryItemBuilder()
                .setURL(child.image.url);

            if (child.image.alt) {
                item.setDescription(child.image.alt);
            }

            container.addMediaGalleryComponents(
                new MediaGalleryBuilder().addItems(item),
            );
        }
    }

    return container;
}
