import type { APIUserSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "@src/main";

export default class UserSelect extends Select {
    public defaultValues: APIUserSelectComponent["default_values"];

    constructor(data?: APIUserSelectComponent) {
        super(data);

        this.defaultValues = data?.default_values ?? [];
    }

    setDefaultValues(...values: APIUserSelectComponent["default_values"]) {
        this.defaultValues = values;
        return this;
    }

    toJSON(): APIUserSelectComponent {
        return {
            type: this.type as ComponentType.UserSelect,
            custom_id: this.customId,
            default_values: this.defaultValues,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues,
        };
    }
}