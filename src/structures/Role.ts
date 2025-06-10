import { APIRole, Snowflake, RoleFlags, PermissionFlagsBits, APIRoleTags } from "discord-api-types/v10";
import { Base, Client, Guild, Permissions, Flags, Members } from "@src/main";

export default class Role extends Base {
    public id: Snowflake;
    public name: string;
    public color: number;
    public hoist: boolean;
    public icon?: string | null;
    public unicodeEmoji?: string | null;
    public position: number;
    public permissions: Permissions<typeof PermissionFlagsBits>;
    public managed: boolean;
    public mentionable: boolean;
    public tags?: {
        botId?: Snowflake;
        integrationId?: Snowflake;
        premiumSubscriber?: boolean;
        subscriptionListingId?: Snowflake;
        availableForPurchase?: boolean;
        guildConnections?: boolean;
    };
    public flags?: Flags<typeof RoleFlags>;
    public members: Members;
    public guildId: Snowflake;
    public guild: Guild;

    constructor(client: Client, guild: Guild, data?: APIRole) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.hoist = data.hoist;
        this.icon = data.icon ?? null;
        this.unicodeEmoji = data.unicode_emoji ?? null;
        this.position = data.position;
        this.permissions = new Permissions(BigInt(data.permissions), PermissionFlagsBits);
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.tags = {
            botId: data.tags?.bot_id,
            integrationId: data.tags?.integration_id,
            premiumSubscriber: data.tags?.premium_subscriber ?? false,
            subscriptionListingId: data.tags?.subscription_listing_id,
            availableForPurchase: data.tags?.available_for_purchase ?? false,
            guildConnections: data.tags?.guild_connections ?? false,
        };
        this.flags = new Flags(data.flags, RoleFlags);
        this.members = new Members(client, guild);
        this.guildId = guild.id;
        this.guild = guild;

        const members = this.guild.members.filter(member => member.roles.has(this.id));
        this.members.fix(members);
    }

    public async fetch() {
        const updated = await this.guild.roles.fetch(this.id);
        Object.assign(this, updated);

        return this;
    }

    public toJSON(): APIRole {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            hoist: this.hoist,
            icon: this.icon,
            unicode_emoji: this.unicodeEmoji,
            position: this.position,
            permissions: String(this.permissions.bitfield),
            managed: this.managed,
            mentionable: this.mentionable,
            tags: {
                bot_id: this.tags?.botId,
                integration_id: this.tags?.integrationId,
                premium_subscriber: this.tags?.premiumSubscriber || null,
                subscription_listing_id: this.tags?.subscriptionListingId,
                available_for_purchase: this.tags?.availableForPurchase || null,
                guild_connections: this.tags?.guildConnections || null,
            } as APIRoleTags,
            flags: Number(this.flags?.bitfield)
        };
    }
}