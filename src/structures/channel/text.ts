import { APITextChannel, ChannelFlags } from "discord-api-types/v10";
import { Client, Flags, Base, Guild } from "@src/main";
import { getTimestamp } from "@utils/string";
import { patchMessage } from "@utils/functions";

export default class TextChannel extends Base {
    public id: string;
    public type: number;
    public name?: string;
    public topic?: string;
    public position?: number;
    public guildId?: string;
    public rateLimitPerUser?: number;
    public lastMessageId?: string;
    public lastPinTimestamp?: string;
    public nsfw?: boolean;
    public defaultAutoArchiveDuration?: number;
    public defaultThreadRateLimitPerUser?: number;
    public parentId?: string;
    public flags?: Flags;

    constructor(client: Client, data?: APITextChannel) {
        super(client);
        if (!data) return;

        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.topic = data.topic;
        this.position = data.position;
        this.guildId = data.guild_id;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.lastMessageId = data.last_message_id;
        this.lastPinTimestamp = data.last_pin_timestamp;
        this.nsfw = data.nsfw;
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
        this.parentId = data.parent_id;
        this.flags = new Flags(data.flags ?? 0, ChannelFlags);
    }

    get createdTimestamp() {
        return getTimestamp(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    get url() {
        return this.client.rest.url(`/channels/${this.id}`);
    }

    get deletable() {
        return this.guild?.me?.can("MANAGE_CHANNELS") ?? false;
    }

    get manageable() {
        return this.guild?.me?.can("MANAGE_CHANNELS") ?? false;
    }

    get viewable() {
        return this.guild?.me?.can("VIEW_CHANNEL") ?? false;
    }

    get guild(): Guild | undefined {
        return this.client.guilds.get(this.guildId!);
    }

    get lastMessage() {
        return this.client.messages.get(this.lastMessageId!);
    }

    get lastPinAt() {
        return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : undefined;
    }

    get members() {
        return this.guild?.members.filter(member =>
            member.permissionsIn(this).has("VIEW_CHANNEL")
        );
    }

    get messages() {
        return this.client.messages.cache.filter(msg => msg.channelId === this.id);
    }

    get parent() {
        return this.guild?.channels.get(this.parentId!);
    }

    public async send(...options: (string | any)[]) {
        return this.client.rest.post(`/channels//${this.guildId}/${this.id}/messages`, {
            body: patchMessage(options)
        });
    }

    toString() {
        return `<#${this.id}>`;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            topic: this.topic,
            position: this.position,
            guild_id: this.guildId,
            rate_limit_per_user: this.rateLimitPerUser,
            last_message_id: this.lastMessageId,
            last_pin_timestamp: this.lastPinTimestamp,
            nsfw: this.nsfw,
            default_auto_archive_duration: this.defaultAutoArchiveDuration,
            default_thread_rate_limit_per_user: this.defaultThreadRateLimitPerUser,
            parent_id: this.parentId,
            flags: Number(this.flags?.bitfield ?? 0)
        };
    }
}
