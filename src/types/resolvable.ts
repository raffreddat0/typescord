import type { Snowflake } from "discord-api-types/globals";
import type { User, BaseChannel, Guild, Member, Role } from "@src/main";

export type UserResolvable = Snowflake | User;
export type ChannelResolvable = Snowflake | BaseChannel;
export type GuildResolvable = Snowflake | Guild;
export type MemberResolvable = Snowflake | Member;
export type RoleResolvable = Snowflake | Role;

export type EnumResolvable<T extends Record<string, string | number | bigint>> = keyof T | (keyof T)[] | number | bigint;