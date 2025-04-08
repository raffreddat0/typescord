import { APIGuild } from "discord-api-types/v10";
import { GuildData } from "types/guild";

export default class Guild implements GuildData {
    public id: string;
    public name: string;
    public icon: string | null;
    public splash: string | null;
    public discoverySplash: string | null;
    public features: string[];
    public mfaLevel: number;

    constructor(data: APIGuild) {
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.features = data.features;
        this.mfaLevel = data.mfa_level;
    }
}