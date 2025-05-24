import type { APIMessage } from "discord-api-types/v10";
import { Client, User } from "@src/main";
import Base from "@structures/base";

export default class Message extends Base {
    public id: string;
    public channelId: string;
    public authorId: string;
    public author: User;
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
        this.author = new User(this.client, data.author);
        this.content = data.content;
        this.createdAt = new Date(data.timestamp);
        this.createdTimestamp = this.createdAt.getTime();
        this.components = data.components ?? null;
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