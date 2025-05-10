import type { Snowflake } from "discord-api-types/globals";
import type { UserResolvable } from "./user";

export interface FetchUserOptions {
    user: UserResolvable;
    withCounts?: boolean;
}

export interface FetchUsersOptions {
    before?: Snowflake;
    after?: Snowflake;
    limit?: number;
}