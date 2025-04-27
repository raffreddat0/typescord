import { GatewayIntentBits } from "discord-api-types/v10";

export interface ClientOptions {
    intents: number | (keyof typeof GatewayIntentBits)[];
    instances?: any[];
    token?: string;
};