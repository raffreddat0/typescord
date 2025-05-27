import type { APIGuild } from "discord-api-types/v10";
import type { GuildResolvable } from "types/guild";
import type { FetchGuildOptions, FetchGuildsOptions } from "types/guilds";
import { Routes } from "discord-api-types/v10";
import { Client, Guild } from "@src/main";
import Cache from "./main";

export default class Guilds extends Cache<Guild> {

    constructor(client: Client) {
        super(client);

        if (this.client.options.cache.guilds)
            this.load();
    }

    async fetch(resolvable: GuildResolvable): Promise<Guild>;
    async fetch(options: FetchGuildOptions): Promise<Guild>;
    async fetch(options?: FetchGuildsOptions): Promise<this>;
    async fetch(options?: GuildResolvable | FetchGuildOptions | FetchGuildsOptions) {
        let url, multiple = false;

        if (!options)
            url = Routes.userGuilds();
        else {
            const resolve = this.resolveId(options as GuildResolvable);
            if (resolve) {
                if (this.has(resolve))
                    return this.get(resolve);
                url = Routes.guild(resolve);
            } else if (typeof options === "object")
                if ("guild" in options) {
                    url = Routes.guild(this.resolveId(options.guild));
                    if ("withCounts" in options)
                        url += `?with_counts=${options.withCounts}`;
                } else if ("before" in options || "after" in options || "limit" in options) {
                    url = Routes.userGuilds();
                    if ("before" in options)
                        url += `?before=${options.before}`;
                    if ("after" in options)
                        url += `?after=${options.after}`;
                    if ("limit" in options)
                        url += `?limit=${options.limit}`;
                    multiple = true;
                }
        }

        if (!url)
            throw new Error("Invalid options");

        const data = await this.client.rest.get(url) as APIGuild | APIGuild[];

        if (multiple) {
            this.fix(data);
            return this;
        }

        const guild = new Guild(this.client, data as APIGuild);
        this.set(guild.id, guild);

        return guild;
    }

    resolveId(resolvable: GuildResolvable) {
        if (resolvable instanceof Guild)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    resolve(resolvable: GuildResolvable) {
        if (resolvable instanceof Guild)
            return resolvable;

        return super.resolve(resolvable);
    }

    fix(data: Guild | Guild[] | APIGuild | APIGuild[]) {
        if (!data)
            return;

        if (Array.isArray(data))
            for (const guild of data)
                this.fix(guild);

        else if (!(data instanceof Guild)) {
            const fixed = new Guild(this.client, data);
            this.set(data.id, fixed);
        } else
            this.set(data.id, data);

    }

    load() {
        const data = super.read();
        this.fix(data);
    }
}