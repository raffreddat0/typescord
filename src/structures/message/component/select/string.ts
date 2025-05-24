import type { APIStringSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "@src/main";

export default class StringSelect extends Select {
    public options: APIStringSelectComponent["options"];

    constructor(data?: APIStringSelectComponent) {
        super(data);

        this.options = data?.options ?? [];
    }

    setOptions(...options: APIStringSelectComponent["options"]) {
        this.options = options;
        return this;
    }

    toJSON(): APIStringSelectComponent {
        return {
            type: this.type as ComponentType.StringSelect,
            custom_id: this.customId,
            options: this.options,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues,
        };
    }
}