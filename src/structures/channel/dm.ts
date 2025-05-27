import { APIDMChannel, ChannelFlags } from "discord-api-types/v10";
import { Client, Flags, Base, User } from "@src/main";
import { getTimestamp } from "@utils/string";
import { patchMessage } from "@utils/functions";

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

    public async send(...options: (string | any)[]) {
        return this.client.rest.post(`/channels/${this.id}/messages`, {
            body: patchMessage(options)
        });
    }

    public toString() {
        return `<@${this.userId}}>`;
    }

    public toJSON() {
        return {
            id: this.id,
            type: this.type,
            flags: Number(this.flags.bitfield),
            recipients: [this.user.toJSON()],
        };
    }
}