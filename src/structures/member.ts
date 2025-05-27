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

    constructor(client: Client, data?: APIGuildMember & { guild_id: string }) {
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
        this.guildId = data.guild_id;
        this.user = new User(this.client, data.user);
        this.guild = this.client.guilds.get(data.guild_id);
    }

    get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    public avatarURL(options: {
        size?: number,
        extension?: string
    } = {}) {
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
}