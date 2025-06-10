import type { APIGuild, GuildFeature, Snowflake } from "discord-api-types/v10";
import { Base, Client, Member, Members, Roles } from "@src/main";

export default class Guild extends Base {
    public id: Snowflake;
    public name: string;
    public icon: string | null;
    public splash: string | null;
    public discoverySplash: string | null;
    public features: string[];
    public mfaLevel: number;
    public ownerId: Snowflake;
    public owner: Member;
    public members: Members;
    public roles: Roles;

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
        this.ownerId = data.owner_id;
        this.owner = new Member(this.client, this, { id: this.ownerId });
        this.members = new Members(this.client, this);
        this.roles = new Roles(this.client, this);
    }

    public async fetch() {
        const updated = await this.client.guilds.fetch({ guild: this.id, caching: false });
        await updated.members.fetch();
        await updated.roles.fetch();
        await updated.owner.fetch();

        Object.assign(this, updated);
        return this;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
            splash: this.splash,
            discovery_splash: this.discoverySplash,
            features: this.features as GuildFeature[],
            mfa_level: this.mfaLevel,

        };
    }
}