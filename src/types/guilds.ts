import type { Snowflake } from "discord-api-types/globals";
import type { GuildResolvable } from "./guild";

export interface FetchGuildOptions {
    guild: GuildResolvable;
    withCounts?: boolean;
    caching?: boolean;
}

export interface FetchGuildsOptions {
    before?: Snowflake;
    after?: Snowflake;
    limit?: number;
}