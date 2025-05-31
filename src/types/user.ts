import type { Snowflake } from "discord-api-types/globals";
import type { User } from "@src/main";

export type UserResolvable = Snowflake | User;

export interface AvatarDecoration {
    asset: string;
    skuId: string;
}