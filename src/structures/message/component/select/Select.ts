import { APIBaseSelectMenuComponent, APIStringSelectComponent, ComponentType } from "discord-api-types/v10";
import { BaseComponent, StringSelect } from "@src/main";

type SelectType = ComponentType.ChannelSelect | ComponentType.MentionableSelect | ComponentType.RoleSelect | ComponentType.StringSelect | ComponentType.UserSelect;
export default class Select extends BaseComponent<SelectType> {
    public customId: string | undefined;
    public placeholder: string | null;
    public minValues: number;
    public maxValues: number;
    public disabled: boolean;

    constructor(data?: APIBaseSelectMenuComponent<SelectType>) {
        super(data);

        this.customId = data?.custom_id;
        this.placeholder = data?.placeholder ?? null;
        this.minValues = data?.min_values ?? 1;
        this.maxValues = data?.max_values ?? 1;
        this.disabled = data?.disabled ?? false;
    }

    setType(type: ComponentType.StringSelect): StringSelect;
    setType(type: SelectType) {
        if (type === ComponentType.StringSelect)
            return new StringSelect(this.toJSON() as APIStringSelectComponent);
    }

    setCustomId(customId: string) {
        this.customId = customId;
        return this;
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    setMinValues(minValues: number) {
        this.minValues = minValues;
        return this;
    }

    setMaxValues(maxValues: number) {
        this.maxValues = maxValues;
        return this;
    }

    setDisabled(disabled: boolean) {
        this.disabled = disabled;
        return this;
    }

    toJSON(): APIBaseSelectMenuComponent<SelectType> {
        return {
            type: this.type,
            custom_id: this.customId,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues,
        };
    }
}