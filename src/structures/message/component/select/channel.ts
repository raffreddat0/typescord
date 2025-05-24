import type { APIChannelSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "@src/main";

export default class ChannelSelect extends Select {
    public channelTypes: APIChannelSelectComponent["channel_types"];
    public defaultValues: APIChannelSelectComponent["default_values"];

    constructor(data?: APIChannelSelectComponent) {
        super(data);

        this.channelTypes = data?.channel_types ?? [];
        this.defaultValues = data?.default_values ?? [];
    }

    setChannelTypes(...types: APIChannelSelectComponent["channel_types"]) {
        this.channelTypes = types;
        return this;
    }

    setDefaultValues(...values: APIChannelSelectComponent["default_values"]) {
        this.defaultValues = values;
        return this;
    }

    toJSON(): APIChannelSelectComponent {
        return {
            type: this.type as ComponentType.ChannelSelect,
            custom_id: this.customId,
            default_values: this.defaultValues,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues,
        };
    }
}