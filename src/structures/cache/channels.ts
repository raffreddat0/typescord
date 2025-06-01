import { APIChannel, Routes } from "discord-api-types/v10";
import type { ChannelResolvable } from "types/main";
import { Cache, Client, BaseChannel } from "@src/main";

export default class Channels<T extends BaseChannel<any>> extends Cache<T> {
    private guildId: string;

    constructor(client: Client, guildId?: string) {
        super(client);

        this.guildId = guildId;
    }

    fetch(resolvable: ChannelResolvable): Promise<T>;
    fetch(): Promise<this>;
    public async fetch(resolvable?: ChannelResolvable) {
        let url: string;

        if (!resolvable)
            url = Routes.guildChannels(this.guildId);
        else {
            const resolve = this.resolveId(resolvable as ChannelResolvable);
            if (!resolve)
                throw new Error("Invalid options");

            if (this.has(resolve))
                return this.get(resolve);
            url = Routes.channel(resolve);
        }

        const data = await this.client.rest.get(url);
        if (Array.isArray(data)) {
            await this.fix(data);
            return this;
        }

        const channel = new BaseChannel(this.client, data) as T;
        this.set(channel.id, channel);

        return channel;
    }

    public resolveId(resolvable: ChannelResolvable) {
        if (resolvable instanceof BaseChannel)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    public resolve(channel: ChannelResolvable) {
        if (channel instanceof BaseChannel)
            return channel as T;

        return super.resolve(channel);
    }

    public async fix(data: T | T[] | APIChannel | APIChannel[]) {
        if (Array.isArray(data))
            for (const channel of data)
                this.fix(channel);

        else if (!(data instanceof BaseChannel)) {
            const fixed = new BaseChannel(this.client, data) as T;
            this.set(data.id, fixed);
        } else
            this.set(data.id, data as T);
    }
}