import type { Snowflake } from "discord-api-types/globals";
import type { GuildResolvable, MemberResolvable, UserResolvable, RoleResolvable } from "./resolvable";

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

export interface FetchMemberOptions {
    member?: MemberResolvable;
    user?: UserResolvable;
    caching?: boolean;
}

export interface FetchMembersOptions {
    query?: string;
    limit?: number;
    withPresence?: boolean;
    time?: number;
    nonce?: string;
}

export interface FetchUserOptions {
    user: UserResolvable;
}

export interface FetchRoleOptions {
    role: RoleResolvable;
}
