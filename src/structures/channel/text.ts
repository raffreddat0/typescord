import { APITextChannel, ChannelFlags } from "discord-api-types/v10";
import { Client, Flags, Base } from "@src/main";
import { getTimestamp } from "@utils/string";
import { patchMessage } from "@utils/object";

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
    //public permissionOverwrites?: APIOverwrite[];
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
        //this.permissionOverwrites = data.permission_overwrites;
        this.flags = new Flags(data.flags, ChannelFlags);
    }

    get createdTimestamp() {
        return getTimestamp(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    get url() {
        return this.client.rest.url(`/channels/${this.guildId}/${this.id}`);
    }

    public async send(...options: (string | any)[]) {
        return this.client.rest.post(`/channels//${this.guildId}/${this.id}/messages`, {
            body: patchMessage(options)
        });
    }

    public toString() {
        return `<#${this.id}}>`;
    }

    public toJSON() {
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
            //permission_overwrites: this.permissionOverwrites,
            flags: Number(this.flags.bitfield)
        };
    }
}