import type { GatewayIntentBits } from "discord-api-types/v10";
import type { EnumResolvable } from "types/main";
import { Intents } from "@src/main";

export interface CacheOptions {
    guilds?: boolean;
    channels?: boolean;
    members?: boolean;
    messages?: boolean;
    users?: boolean;
    roles?: boolean;
    emojis?: boolean;
}

export interface ClientOptions {
    intents: Intents | EnumResolvable<typeof GatewayIntentBits>;
    token?: string;
    cache?: CacheOptions;
};

export interface RestOptions {
    token: string;
    path?: string;
    cdn?: string;
}