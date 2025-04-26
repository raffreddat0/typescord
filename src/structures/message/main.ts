import { APIMessage } from "discord-api-types/v10"
import Client from "@structures/client/main";
import Base from "@structures/base";

export default class Message extends Base {
    public id: string;
    public channelId: string;
    public authorId: string;
    public author: InstanceType<Client["instances"]["user"]>;
    public content: string;
    public createdAt: Date;
    public createdTimestamp: number;
    public components: any | null;

    constructor(client: Client, data?: APIMessage) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.channelId = data.channel_id;
        this.authorId = data.author.id;
        this.author = new this.client.instances["user"](this.client, data.author);
        this.content = data.content;
        this.createdAt = new Date(data.timestamp);
        this.createdTimestamp = this.createdAt.getTime();
        this.components = data.components ?? null;
    }

    reply(...options: any[]): void {
        const data: any = {};
        if (typeof options[0] === "string") {
            data["content"] = options[0];
        } else if (typeof options[0] === "object") {
            data["content"] = options[0].content || null;
            data["embeds"] = options[0].embeds || null;
            data["components"] = options[0].components || null;
        }

        if (options[1]) {
            if (typeof options[1] === "object")
                data["components"] = options[1] || null;
            else if (typeof options[1] === "boolean")
                data["ephemeral"] = options[1];
        }

        if (options[2] && typeof options[1] === "boolean")
            data["ephemeral"] = options[2];
    }

    toJSON(): any {
        return {
            id: this.id,
            channel_id: this.channelId,
            author_id: this.authorId,
            content: this.content,
            timestamp: this.createdAt.toISOString(),
            components: this.components.map((row: any) => ({
                type: 1,
                components: row.map((components: any) => components.toJSON())
            }))
        };
    }
}