import type { APIGuildMember } from "discord-api-types/v10";
import { Client, User, Guild, Base } from "@src/main";

export default class Member extends Base {
    public id: string;
    public nickname: string;
    public avatar: string;
    public banner: string;
    public joinedTimestamp: number;
    public deaf: boolean;
    public mute: boolean;
    public pending: boolean;
    public guildId: string;
    public user: User;
    public guild: Guild;

    constructor(client: Client, guild: Guild, data?: APIGuildMember) {
        super(client);

        if (!data) return;
        this.id = data.user.id;
        this.nickname = data.nick;
        this.avatar = data.avatar;
        this.banner = data.banner;
        this.joinedTimestamp = new Date(data.joined_at).getTime();
        this.deaf = data.deaf;
        this.mute = data.mute;
        this.pending = data.pending;
        this.guildId = guild.id;
        this.user = new User(this.client, data.user);
        this.guild = guild;
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

    public toJSON(): Omit<APIGuildMember, "roles" | "flags"> {
        return {
            nick: this.nickname,
            avatar: this.avatar,
            banner: this.banner,
            joined_at: this.joinedAt.toISOString(),
            deaf: this.deaf,
            mute: this.mute,
            pending: this.pending,
            user: this.user.toJSON()
        };
    }
}