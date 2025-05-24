import { APIButtonComponentWithCustomId, APIButtonComponentWithURL, ComponentType } from "discord-api-types/v10";
import { BaseComponent } from "@src/main";

export default class Button extends BaseComponent<ComponentType.Button> {
    public customId: string | undefined;
    public disabled: boolean;
    public label: string | null;
    public style: number | null;
    public url: string | null;
    public emoji: any | null;

    constructor(data?: APIButtonComponentWithCustomId | APIButtonComponentWithURL) {
        super(data);

        this.customId = (data as APIButtonComponentWithCustomId)?.custom_id ?? undefined;
        this.disabled = data?.disabled ?? false;
        this.label = data?.label ?? null;
        this.style = data?.style ?? null;
        this.url = (data as APIButtonComponentWithURL)?.url ?? null;
        this.emoji = data?.emoji ?? null;
    }

    setLabel(label: string) {
        this.label = label;
        return this;
    }

    setStyle(style: number) {
        this.style = style;
        return this;
    }

    setDisabled(disabled: boolean) {
        this.disabled = disabled;
        return this;
    }

    setEmoji(emoji: any) {
        this.emoji = emoji;
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    setCustomId(customId: string) {
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