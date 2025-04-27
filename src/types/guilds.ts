import { Snowflake } from "discord-api-types/globals";
import { GuildResolvable } from "./guild";

export interface FetchGuildOptions {
    guild: GuildResolvable;
    withCounts?: boolean;
}

export interface FetchGuildsOptions {
    before?: Snowflake;
    after?: Snowflake;
    limit?: number;
}