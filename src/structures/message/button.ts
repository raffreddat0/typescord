import { APIButtonComponentWithCustomId, APIButtonComponentWithURL } from "discord-api-types/v10";

export default class Button {
    public type: number;
    public customId: string | undefined;
    public disabled: boolean;
    public label: string | null;
    public style: number | null;
    public url: string | null;
    public emoji: any | null;

    constructor(data?: APIButtonComponentWithCustomId | APIButtonComponentWithURL) {
        this.type = data?.type ?? 0;
        this.customId = (data as APIButtonComponentWithCustomId)?.custom_id ?? undefined;
        this.disabled = data?.disabled ?? false;
        this.label = data?.label ?? null;
        this.style = data?.style ?? null;
        this.url = (data as APIButtonComponentWithURL)?.url ?? null;
        this.emoji = data?.emoji ?? null;
    }

    setLabel(label: string): this {
        this.label = label;
        return this;
    }

    setStyle(style: number): this {
        this.style = style;
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        return this;
    }

    setEmoji(emoji: any): this {
        this.emoji = emoji;
        return this;
    }

    setUrl(url: string): this {
        this.url = url;
        return this;
    }

    setCustomId(customId: string): this {
        this.customId = customId;
        return this;
    }

    toJSON(): APIButtonComponentWithCustomId | APIButtonComponentWithURL {
        return {
            type: this.type,
            custom_id: this.customId,
            disabled: this.disabled,
            label: this.label,
            style: this.style,
            url: this.url,
            emoji: this.emoji,
        };
    }
}