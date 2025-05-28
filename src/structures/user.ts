import { APIUser, Snowflake, UserPremiumType, UserFlags } from "discord-api-types/v10";
import isEqual from "lodash/isEqual";
import type { AvatarDecoration } from "types/user";
import { Base, Client, Flags } from "@src/main";
import { getTimestamp } from "@utils/string";

export default class User extends Base {
    public id: Snowflake;
    public username: string;
    public discriminator: string;
    public globalName: string | null;
    public avatar: string | null;
    public bot?: boolean | null;
    public system?: boolean;
    public mfaEnabled?: boolean;
    public banner?: string | null;
    public accentColor?: number | null;
    public locale?: string;
    public verified?: boolean;
    public email?: string | null;
    public flags?: Flags<typeof UserFlags>;
    public premiumType?: UserPremiumType;
    public avatarDecoration?: AvatarDecoration | null;

    constructor(client: Client, data?: APIUser) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.globalName = data.global_name ?? null;
        this.avatar = data.avatar ?? null;
        this.bot = data.bot ?? null;
        this.system = data.system;
        this.mfaEnabled = data.mfa_enabled;
        this.banner = data.banner ?? null;
        this.accentColor = data.accent_color ?? null;
        this.locale = data.locale;
        this.verified = data.verified;
        this.email = data.email ?? null;
        this.flags = new Flags(data.flags ?? 0, UserFlags);
        this.premiumType = data.premium_type ?? null;
        this.avatarDecoration = data.avatar_decoration_data ? {
            asset: data.avatar_decoration_data.asset ,
            skuId: data.avatar_decoration_data.sku_id,
        } : null;
    }

    get tag() {
        return `${this.username}#${this.discriminator}`;
    }

    get displayName() {
        return this.globalName || this.username;
    }

    get createdTimestamp() {
        return getTimestamp(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    get hexAccentColor() {
        if (typeof this.accentColor !== "number") return this.accentColor;
        return `#${this.accentColor.toString(16).padStart(6, "0")}`;
    }

    get defaultAvatarURL() {
        const index = this.discriminator === "0" ? Number(BigInt(this.id) >> 22n) % 6 : Number(this.discriminator) % 5;
        return this.client.rest.url(`/embed/avatars/${index}.png`, true);
    }

    get dmChannel() {
        return this.client.users.dmChannel(this.id);
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

    public avatarDecorationURL() {
        if (!this.avatarDecoration)
            return null;

        return this.client.rest.url(`/avatar-decoration-presets/${this.avatarDecoration.asset}.png`, true);
    }

    public displayAvatarURL(options: {
        size?: number,
        extension?: string
    } = {}) {
        return this.avatarURL(options) ?? this.defaultAvatarURL;
    }

    public bannerURL(options: {
        size?: number,
        extension?: string
    } = {}) {
        if (!this.banner)
            return null;
        if (!options.extension)
            options.extension = this.banner.startsWith("a_") ? ".gif" : ".png";

        return this.banner && this.client.rest.url(`/banners/${this.id}/${this.banner}${options.extension}?size=${options.size || 1024}`, true);
    }

    public createDM() {
        return this.client.users.createDM(this.id);
    }

    public deleteDM() {
        return this.client.users.deleteDM(this.id);
    }

    public equals(user: User) {
        return isEqual(this, user);
    }

    public toString(): string {
        return `<@${this.id}>`;
    }

    public toJSON(): APIUser {
        return {
            id: this.id,
            username: this.username,
            discriminator: this.discriminator,
            global_name: this.displayName,
            avatar: this.avatar,
            bot: this.bot,
            system: this.system,
            mfa_enabled: this.mfaEnabled,
            banner: this.banner,
            accent_color: this.accentColor,
            locale: this.locale,
            verified: this.verified,
            email: this.email,
            flags: Number(this.flags.bitfield),
            premium_type: this.premiumType,
            public_flags: Number(this.flags.bitfield),
            avatar_decoration: this.avatarDecoration?.asset,
            avatar_decoration_data: this.avatarDecoration ? {
                asset: this.avatarDecoration.asset,
                sku_id: this.avatarDecoration.skuId,
            } : null,
        };
    }
}