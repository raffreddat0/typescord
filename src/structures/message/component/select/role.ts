import type { APIRoleSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "@src/main";

export default class RoleSelect extends Select {
    public defaultValues: APIRoleSelectComponent["default_values"];

    constructor(data?: APIRoleSelectComponent) {
        super(data);

        this.defaultValues = data?.default_values ?? [];
    }

    setDefaultValues(...values: APIRoleSelectComponent["default_values"]) {
        this.defaultValues = values;
        return this;
    }

    toJSON(): APIRoleSelectComponent {
        return {
            type: this.type as ComponentType.RoleSelect,
            custom_id: this.customId,
            default_values: this.defaultValues,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues,
        };
    }
}