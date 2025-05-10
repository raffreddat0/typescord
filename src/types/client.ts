import type { GatewayIntentBits } from "discord-api-types/v10";

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
    intents: number | (keyof typeof GatewayIntentBits)[];
    token?: string;
    cache?: CacheOptions;
};