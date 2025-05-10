import { APIDMChannel, ChannelFlags } from "discord-api-types/v10";
import { Client, Flags, Base, User } from "@src/main";
import { getTimestamp } from "@utils/string";

export default class DMChannel extends Base {
    public id: string;
    public type: number;
    public flags?: Flags;
    public user: User;
    public userId: string;

    constructor(client: Client, data?: APIDMChannel) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.type = data.type;
        this.flags = new Flags(data.flags, ChannelFlags);
        this.user = new User(client, data.recipients[0]);
        this.userId = this.user.id;
    }

    get createdTimestamp() {
        return getTimestamp(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    get url() {
        return this.client.rest.url(`/channels/@me/${this.id}`);
    }

    public toString() {
        return `<@${this.userId}}>`;
    }
}