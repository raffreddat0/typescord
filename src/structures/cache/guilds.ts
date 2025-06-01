import { APIGuild, Routes } from "discord-api-types/v10";
import type { GuildResolvable, FetchGuildOptions, FetchGuildsOptions } from "types/main";
import { Cache, Client, Guild } from "@src/main";

export default class Guilds extends Cache<Guild> {

    constructor(client: Client) {
        super(client);
    }

    fetch(resolvable: GuildResolvable): Promise<Guild>;
    fetch(options: FetchGuildOptions): Promise<Guild>;
    fetch(options?: FetchGuildsOptions): Promise<this>;
    public async fetch(options?: GuildResolvable | FetchGuildOptions | FetchGuildsOptions) {
        let url: string, caching = true;

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
                    if ("caching" in options && options.caching === false)
                        caching = false;
                } else if ("before" in options || "after" in options || "limit" in options) {
                    const params = [];
                    if ("before" in options)
                        params.push(`before=${options.before}`);
                    if ("after" in options)
                        params.push(`after=${options.after}`);
                    if ("limit" in options)
                        params.push(`limit=${options.limit}`);

                    url = Routes.userGuilds();
                    if (params.length > 0)
                        url += `?${params.join("&")}`;
                }
        }

        if (!url)
            throw new Error("Invalid options");

        const data = await this.client.rest.get(url);

        if (Array.isArray(data)) {
            await this.fix(data);
            return this;
        }

        const guild = new Guild(this.client, data);
        this.set(guild.id, guild);

        if (caching) {
            if (this.client.options.cache.members)
                await guild.members.fetch();
            await guild.owner.fetch();
        }

        this.set(guild.id, guild); // TODO: Verificare se effettivamente serve o no

        return guild;
    }

    public resolveId(resolvable: GuildResolvable) {
        if (resolvable instanceof Guild)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    public resolve(resolvable: GuildResolvable) {
        if (resolvable instanceof Guild)
            return resolvable;

        return super.resolve(resolvable);
    }

    public async fix(data: Guild | Guild[] | APIGuild | APIGuild[]) {
        if (!data)
            return;

        if (Array.isArray(data))
            for (const guild of data)
                await this.fix(guild);

        else if (!(data instanceof Guild)) {
            const fixed = new Guild(this.client, data);
            this.set(data.id, fixed);
            await fixed.fetch();
            this.set(data.id, fixed); // TODO: Verificare se effettivamente serve o no
        } else
            this.set(data.id, data);
    }
}