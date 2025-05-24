import type { APIChannel } from "discord-api-types/v10";
import type { ChannelResolvable } from "types/channel";
import { Routes } from "discord-api-types/v10";
import { Client, BaseChannel } from "@src/main";
import Cache from "./main";

export default class Channels<T extends BaseChannel<any>> extends Cache<T> {
    private guildId: string;

    constructor(client: Client, guildId?: string) {
        super(client);

        this.guildId = guildId;
    }

    async fetch(resolvable: ChannelResolvable): Promise<T>;
    async fetch(): Promise<this>;
    async fetch(resolvable?: ChannelResolvable) {
        if (!resolvable)
            return this;

        const resolve = this.resolveId(resolvable as ChannelResolvable);
        if (!resolve)
            throw new Error("Invalid options");

        if (this.has(resolve))
            return this.get(resolve);
        const url = Routes.channel(resolve);

        const data = await this.client.rest.get(url) as APIChannel;
        const channel = new BaseChannel(this.client, data) as T;
        this.set(channel.id, channel);

        return channel;
    }

    resolveId(resolvable: ChannelResolvable) {
        if (resolvable instanceof BaseChannel)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    resolve(channel: ChannelResolvable) {
        if (channel instanceof BaseChannel)
            return channel as T;

        return super.resolve(channel);
    }

    fix(data: T | APIChannel | APIChannel[]) {
        if (Array.isArray(data))
            for (const user of data)
                this.fix(user);

        else if (!(data instanceof BaseChannel)) {
            const fixed = new BaseChannel(this.client, data) as T;
            this.set(data.id, fixed);
        } else
            this.set(data.id, data as T);
    }
}