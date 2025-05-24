import type { Snowflake } from "discord-api-types/globals";
import type { BaseChannel } from "@src/main";

export type ChannelResolvable = Snowflake | InstanceType<typeof BaseChannel>;