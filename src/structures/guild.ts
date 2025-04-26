import { APIGuild } from "discord-api-types/v10";
import Client from "@structures/client/main";
import Base from "@structures/base";

export default class Guild extends Base {
    public id: string;
    public name: string;
    public icon: string | null;
    public splash: string | null;
    public discoverySplash: string | null;
    public features: string[];
    public mfaLevel: number;

    constructor(client: Client, data?: APIGuild) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.features = data.features;
        this.mfaLevel = data.mfa_level;
    }
}