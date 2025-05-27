import type { APIGuild } from "discord-api-types/v10";
import { Client, Members } from "@src/main";
import Base from "@structures/base";

export default class Guild extends Base {
    public id: string;
    public name: string;
    public icon: string | null;
    public splash: string | null;
    public discoverySplash: string | null;
    public features: string[];
    public mfaLevel: number;
    public members: Members;

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
        this.members = new Members(this.client, this);

        if (client.ready && client.options.cache.members)
            this.members.fetch();
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
            splash: this.splash,
            discoverySplash: this.discoverySplash,
            features: this.features,
            mfaLevel: this.mfaLevel,
            members: this.members.toArray()
        };
    }
}