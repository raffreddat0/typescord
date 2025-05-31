import { APIChannelBase, ChannelFlags, ChannelType } from "discord-api-types/v10";
import { Client, Flags, Base } from "@src/main";
import { getTimestamp } from "@utils/string";

export default class BaseChannel<T extends ChannelType = ChannelType> extends Base {
    public id: string;
    public type: number;
    public flags?: Flags;

    constructor(client: Client, data?: APIChannelBase<T>) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.type = data.type;
        this.flags = new Flags(data.flags, ChannelFlags);
    }

    get createdTimestamp() {
        return getTimestamp(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    get url() {
        if (this.type === ChannelType.DM)
            return this.client.rest.url(`/channels/@me/${this.id}`);

        return this.client.rest.url(`/channels/${this.id}`);
    }

    public toString() {
        return `<#${this.id}}>`;
    }
}