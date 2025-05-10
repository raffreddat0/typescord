import type { Snowflake } from "discord-api-types/globals";
import type { User } from "@src/main";

export type UserResolvable = Snowflake | InstanceType<typeof User>;

export interface AvatarDecoration {
    asset: string;
    skuId: string;
}