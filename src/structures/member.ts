import { APIGuildMember, GuildMemberFlags, PermissionFlagsBits, Snowflake } from "discord-api-types/v10";
import { Base, Client, User, Guild, Flags, Permissions } from "@src/main";

export default class Member extends Base {
    public id: Snowflake;
    public user: User;
    public nickname?: string | null;
    public avatar?: string | null;
    public banner?: string | null;
    public joinedTimestamp: number;
    public deaf: boolean;
    public mute: boolean;
    public flags: Flags<typeof GuildMemberFlags>;
    public permissions: Permissions<typeof PermissionFlagsBits>;
    public pending?: boolean;
    public guildId: Snowflake;
    public guild: Guild;

    constructor(client: Client, guild: Guild, data?: Partial<APIGuildMember & { id: string }>) {
        super(client);

        if (!data) return;
        if (data?.id)
            this.id = data?.id;
        else {
            this.id = data?.user?.id;
            this.user = new User(this.client, data.user);
            this.nickname = data.nick ?? null;
            this.avatar = data.avatar ?? null;
            this.banner = data.banner ?? null;
            this.joinedTimestamp = new Date(data.joined_at).getTime();
            this.deaf = data.deaf;
            this.mute = data.mute;
            this.flags = new Flags(data.flags, GuildMemberFlags);
            this.permissions = new Permissions(undefined, PermissionFlagsBits);
            this.pending = data.pending;
            this.guildId = guild.id;
            this.guild = guild;
        }
    }

    get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    public avatarURL(options: {
        size?: number,
        extension?: string
    } = {}) {
        if (!this.avatar)
            return null;
        if (!options.extension)
            options.extension = this.avatar.startsWith("a_") ? ".gif" : ".png";

        return this.avatar && this.client.rest.url(`/avatars/${this.id}/${this.avatar}${options.extension}?size=${options.size || 1024}`, true);
    }

    public displayAvatarURL(options: {
        size?: number,
        extension?: string
    } = {}) {
        return this.avatarURL(options) ?? this.user.displayAvatarURL(options);
    }

    public bannerURL(options: {
        size?: number,
        extension?: string
    } = {}) {
        if (!this.banner)
            return null;
        if (!options.extension)
            options.extension = this.avatar.startsWith("a_") ? ".gif" : ".png";

        return this.banner && this.client.rest.url(`/banners/${this.id}/${this.banner}${options.extension}?size=${options.size || 1024}`, true);
    }

    public displayBannerURL(options: {
        size?: number,
        extension?: string
    } = {}) {
        return this.bannerURL(options) ?? this.user.bannerURL(options);
    }

    public async fetch() {
        const updated = await this.guild.members.fetch({ member: this.id, caching: false });
        Object.assign(this, updated);
    }

    public toJSON(): Omit<APIGuildMember, "roles"> {
        return {
            user: this.user.toJSON(),
            nick: this.nickname,
            avatar: this.avatar,
            banner: this.banner,
            joined_at: this.joinedAt.toISOString(),
            deaf: this.deaf,
            mute: this.mute,
            flags: Number(this.flags.bitfield),
            pending: this.pending
        };
    }
}