import type { APIGuild } from 'discord-api-types/v10';
import type { GuildResolvable } from 'types/guild';
import type { FetchGuildOptions, FetchGuildsOptions } from 'types/guilds';
import Client from '@structures/client/main';
import Guild from '@structures/guild';
import Cache from './main';

export default class Guilds extends Cache<string, Guild> {
    constructor(client: Client) {
        super(client);
    }

    async fetch(GuildResolveable: GuildResolvable): Promise<Guild>;
    async fetch(options: FetchGuildOptions): Promise<Guild>;
    async fetch(options: FetchGuildsOptions): Promise<this>;
    async fetch(options?: GuildResolvable | FetchGuildOptions | FetchGuildsOptions) {
        let url, multiple = false;

        if (!options)
            url = "/users/@me/guilds";
        else if (typeof options === "string")
            url = `/guilds/${options}`;
        else if (typeof options === "object") {
            if ('guild' in options) {
                url = `/guilds/${options.guild}`;
                if ('withCounts' in options)
                    url += `?with_counts=${options.withCounts}`;
            } else if ('before' in options || 'after' in options || 'limit' in options) {
                url = `/users/@me/guilds`;
                if ('before' in options)
                    url += `?before=${options.before}`;
                if ('after' in options)
                    url += `?after=${options.after}`;
                if ('limit' in options)
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
    
    fix(data: APIGuild | APIGuild[]) {
        if (Array.isArray(data)) {
            for (const guild of data) {
                if (!(guild instanceof Guild)) {
                    const fixed = new Guild(this.client, guild);
                    this.set(guild.id, fixed);
                } else
                    this.set(guild.id, guild);
            }
        } else if (!(data instanceof Guild)) {
            const fixed = new Guild(this.client, data);
            this.set(data.id, fixed);
        } else
            this.set(data.id, data);
    }
}