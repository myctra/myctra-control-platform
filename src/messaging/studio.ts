import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, EmbedBuilder, MentionableSelectMenuBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, RoleSelectMenuBuilder, SectionBuilder, SeparatorBuilder, StringSelectMenuBuilder, TextDisplayBuilder, UserSelectMenuBuilder } from 'discord.js';

export type MyctraSelectType='string'|'user'|'role'|'channel'|'mentionable';
export type MyctraStudioElement=TextDisplayBuilder|SeparatorBuilder|MediaGalleryBuilder|SectionBuilder|ActionRowBuilder<ButtonBuilder>|ContainerBuilder;
export interface MyctraStudioImage{url:string;description?:string;}
export interface MyctraStudioEmbed{data:ConstructorParameters<typeof EmbedBuilder>[0];}
export interface MyctraStudioButton{label:string;style:ButtonStyle;customId?:string;url?:string;emoji?:string;}
export interface MyctraStudioSelect{type:MyctraSelectType;customId:string;placeholder?:string;minValues?:number;maxValues?:number;}
export interface MyctraStudioWebhook{id:string;name:string;avatarUrl?:string;channelId:string;}
export interface MyctraStudioMessage{content?:string;containers:MyctraStudioElement[];embeds?:MyctraStudioEmbed[];webhook?:MyctraStudioWebhook;}
export interface MyctraStudioTemplate{id:string;name:string;description?:string;message:MyctraStudioMessage;createdAt:string;updatedAt:string;}

export function text(content:string){return new TextDisplayBuilder().setContent(content);}
export function separator(){return new SeparatorBuilder();}
export function media(url:string,description?:string){const item=new MediaGalleryItemBuilder().setURL(url);if(description)item.setDescription(description);return new MediaGalleryBuilder().addItems(item);}
export function container(...elements:MyctraStudioElement[]){return new ContainerBuilder().addTextDisplayComponents(...elements.filter(e=>e instanceof TextDisplayBuilder) as TextDisplayBuilder[]);}
export function button(data:MyctraStudioButton){const b=new ButtonBuilder().setLabel(data.label).setStyle(data.style);if(data.customId)b.setCustomId(data.customId);if(data.url)b.setURL(data.url);if(data.emoji)b.setEmoji(data.emoji);return b;}
export function stringSelect(data:MyctraStudioSelect){return new StringSelectMenuBuilder().setCustomId(data.customId).setPlaceholder(data.placeholder??'Choose an option');}
export function userSelect(data:MyctraStudioSelect){return new UserSelectMenuBuilder().setCustomId(data.customId).setPlaceholder(data.placeholder??'Choose a user');}
export function roleSelect(data:MyctraStudioSelect){return new RoleSelectMenuBuilder().setCustomId(data.customId).setPlaceholder(data.placeholder??'Choose a role');}
export function channelSelect(data:MyctraStudioSelect){return new ChannelSelectMenuBuilder().setCustomId(data.customId).setPlaceholder(data.placeholder??'Choose a channel');}
export function mentionableSelect(data:MyctraStudioSelect){return new MentionableSelectMenuBuilder().setCustomId(data.customId).setPlaceholder(data.placeholder??'Choose a member or role');}
export function embed(data:ConstructorParameters<typeof EmbedBuilder>[0]={}){return new EmbedBuilder(data);}
