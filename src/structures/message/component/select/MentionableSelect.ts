import type { APIMentionableSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "@src/main";

export default class MentionableSelect extends Select {
    public defaultValues: APIMentionableSelectComponent["default_values"];

    constructor(data?: APIMentionableSelectComponent) {
        super(data);

        this.defaultValues = data?.default_values ?? [];
    }

    setDefaultValues(...values: APIMentionableSelectComponent["default_values"]) {
        this.defaultValues = values;
        return this;
    }

    toJSON(): APIMentionableSelectComponent {
        return {
            type: this.type as ComponentType.MentionableSelect,
            custom_id: this.customId,
            default_values: this.defaultValues,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues,
        };
    }
}