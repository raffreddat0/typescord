import type { Snowflake } from "discord-api-types/globals";
import type { MemberResolvable } from "./member";

export interface FetchMemberOptions {
    member: MemberResolvable;
    withCounts?: boolean;
}

export interface FetchMembersOptions {
    before?: Snowflake;
    after?: Snowflake;
    limit?: number;
}