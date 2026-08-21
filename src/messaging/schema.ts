export type MyctraElementType =
    | "container"
    | "text"
    | "separator"
    | "image"
    | "embed"
    | "button"
    | "select"
    | "section";

export type MyctraSelectType =
    | "string"
    | "user"
    | "role"
    | "channel"
    | "mentionable";

export interface MyctraImage {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
}

export interface MyctraText {
    content: string;
}

export interface MyctraButton {
    label: string;
    style: "primary" | "secondary" | "success" | "danger" | "link";
    customId?: string;
    url?: string;
    emoji?: string;
    disabled?: boolean;
}

export interface MyctraSelectOption {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}

export interface MyctraSelect {
    type: MyctraSelectType;
    customId: string;
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    disabled?: boolean;
    options?: MyctraSelectOption[];
}

export interface MyctraAccessory {
    type: "button" | "image";
    button?: MyctraButton;
    image?: MyctraImage;
}

export interface MyctraSection {
    text: MyctraText;
    accessory?: MyctraAccessory;
}

export interface MyctraEmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface MyctraEmbedData {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    author?: string;
    thumbnail?: MyctraImage;
    image?: MyctraImage;
    fields?: MyctraEmbedField[];
    footer?: string;
}

export interface MyctraElement {
    id: string;
    type: MyctraElementType;

    text?: MyctraText;
    image?: MyctraImage;
    embed?: MyctraEmbedData;
    button?: MyctraButton;
    select?: MyctraSelect;
    section?: MyctraSection;

    /*
     * Free ordered element list.
     *
     * There is intentionally NO fixed pattern.
     *
     * Example:
     * [image, text, select, button, image, text]
     *
     * Or:
     * [text, text, image, button, select]
     */
    children?: MyctraElement[];
}

export interface MyctraWebhookConfig {
    id?: string;
    name?: string;
    avatarUrl?: string;
    channelId?: string;
}

export interface MyctraMessageDocument {
    version: 1;
    content?: string;

    /*
     * Top-level ordered elements.
     */
    elements: MyctraElement[];

    webhooks?: MyctraWebhookConfig[];
}

export interface MyctraMessageTemplate {
    id: string;
    name: string;
    description?: string;
    document: MyctraMessageDocument;
    createdAt: string;
    updatedAt: string;
}
