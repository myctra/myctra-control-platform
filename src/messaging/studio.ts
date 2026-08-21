import type {
    MyctraButton,
    MyctraElement,
    MyctraEmbedData,
    MyctraImage,
    MyctraMessageDocument,
    MyctraSelect,
    MyctraSelectOption,
    MyctraText,
} from "./schema.js";

export type MyctraStudioElement = MyctraElement;
export type MyctraStudioImage = MyctraImage;
export type MyctraStudioEmbed = MyctraEmbedData;
export type MyctraStudioButton = MyctraButton;
export type MyctraStudioSelect = MyctraSelect;

export interface MyctraStudioWebhook {
    id?: string;
    name?: string;
    avatarUrl?: string;
    channelId?: string;
}

export interface MyctraStudioMessage {
    content?: string;
    elements: MyctraStudioElement[];
    webhooks?: MyctraStudioWebhook[];
}

export interface MyctraStudioTemplate {
    id: string;
    name: string;
    description?: string;
    document: MyctraStudioMessage;
    createdAt: string;
    updatedAt: string;
}

function id(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

export function text(content: string): MyctraStudioElement {
    const value: MyctraText = { content };

    return {
        id: id("text"),
        type: "text",
        text: value,
    };
}

export function separator(): MyctraStudioElement {
    return {
        id: id("separator"),
        type: "separator",
    };
}

export function media(
    url: string,
    alt?: string,
): MyctraStudioElement {
    const image: MyctraImage = {
        url,
        alt,
    };

    return {
        id: id("image"),
        type: "image",
        image,
    };
}

export function button(
    data: MyctraButton,
): MyctraStudioElement {
    return {
        id: id("button"),
        type: "button",
        button: data,
    };
}

export function stringSelect(
    customId: string,
    options: MyctraSelectOption[] = [],
    settings: Omit<
        MyctraSelect,
        "type" | "customId" | "options"
    > = {},
): MyctraStudioElement {
    return select({
        type: "string",
        customId,
        options,
        ...settings,
    });
}

export function userSelect(
    customId: string,
    settings: Omit<
        MyctraSelect,
        "type" | "customId"
    > = {},
): MyctraStudioElement {
    return select({
        type: "user",
        customId,
        ...settings,
    });
}

export function roleSelect(
    customId: string,
    settings: Omit<
        MyctraSelect,
        "type" | "customId"
    > = {},
): MyctraStudioElement {
    return select({
        type: "role",
        customId,
        ...settings,
    });
}

export function channelSelect(
    customId: string,
    settings: Omit<
        MyctraSelect,
        "type" | "customId"
    > = {},
): MyctraStudioElement {
    return select({
        type: "channel",
        customId,
        ...settings,
    });
}

export function mentionableSelect(
    customId: string,
    settings: Omit<
        MyctraSelect,
        "type" | "customId"
    > = {},
): MyctraStudioElement {
    return select({
        type: "mentionable",
        customId,
        ...settings,
    });
}

export function select(
    data: MyctraSelect,
): MyctraStudioElement {
    return {
        id: id("select"),
        type: "select",
        select: data,
    };
}

export function embed(
    data: MyctraEmbedData,
): MyctraStudioElement {
    return {
        id: id("embed"),
        type: "embed",
        embed: data,
    };
}

export function container(
    ...elements: MyctraStudioElement[]
): MyctraStudioElement {
    return {
        id: id("container"),
        type: "container",
        children: [...elements],
    };
}

/*
 * Creates a completely free-form message.
 *
 * No fixed order exists.
 *
 * Example:
 *
 * message(
 *     media("image-1"),
 *     text("Hello"),
 *     stringSelect("menu-1"),
 *     media("image-2"),
 *     text("Choose an action"),
 *     button({
 *         label: "Continue",
 *         style: "primary",
 *         customId: "continue",
 *     }),
 * );
 */
export function message(
    ...elements: MyctraStudioElement[]
): MyctraStudioMessage {
    return {
        elements: [...elements],
    };
}

/*
 * Adds an element to the end of an existing element list.
 */
export function addElement(
    elements: MyctraStudioElement[],
    element: MyctraStudioElement,
): MyctraStudioElement[] {
    return [
        ...elements,
        element,
    ];
}

/*
 * Inserts an element at an exact position.
 */
export function insertElement(
    elements: MyctraStudioElement[],
    index: number,
    element: MyctraStudioElement,
): MyctraStudioElement[] {
    const result = [...elements];

    const safeIndex = Math.max(
        0,
        Math.min(index, result.length),
    );

    result.splice(
        safeIndex,
        0,
        element,
    );

    return result;
}

/*
 * Removes an element by its ID.
 */
export function removeElement(
    elements: MyctraStudioElement[],
    elementId: string,
): MyctraStudioElement[] {
    return elements.filter(
        (element) => element.id !== elementId,
    );
}

/*
 * Moves an element from one position to another.
 */
export function moveElement(
    elements: MyctraStudioElement[],
    fromIndex: number,
    toIndex: number,
): MyctraStudioElement[] {
    const result = [...elements];

    if (
        fromIndex < 0 ||
        fromIndex >= result.length ||
        toIndex < 0 ||
        toIndex >= result.length
    ) {
        return result;
    }

    const [element] = result.splice(
        fromIndex,
        1,
    );

    result.splice(
        toIndex,
        0,
        element,
    );

    return result;
}

/*
 * Updates one element without changing its position.
 */
export function updateElement(
    elements: MyctraStudioElement[],
    elementId: string,
    update: Partial<MyctraStudioElement>,
): MyctraStudioElement[] {
    return elements.map((element) => {
        if (element.id !== elementId) {
            return element;
        }

        return {
            ...element,
            ...update,
            id: element.id,
        };
    });
}

/*
 * Moves an element one position upward.
 */
export function moveElementUp(
    elements: MyctraStudioElement[],
    elementId: string,
): MyctraStudioElement[] {
    const index = elements.findIndex(
        (element) => element.id === elementId,
    );

    if (index <= 0) {
        return [...elements];
    }

    return moveElement(
        elements,
        index,
        index - 1,
    );
}

/*
 * Moves an element one position downward.
 */
export function moveElementDown(
    elements: MyctraStudioElement[],
    elementId: string,
): MyctraStudioElement[] {
    const index = elements.findIndex(
        (element) => element.id === elementId,
    );

    if (
        index === -1 ||
        index >= elements.length - 1
    ) {
        return [...elements];
    }

    return moveElement(
        elements,
        index,
        index + 1,
    );
}

/*
 * Converts the Studio message into the canonical
 * MyctraMessageDocument used by the renderer.
 */
export function toDocument(
    studioMessage: MyctraStudioMessage,
): MyctraMessageDocument {
    return {
        version: 1,
        content: studioMessage.content,
        elements: [...studioMessage.elements],
        webhooks: studioMessage.webhooks,
    };
}
