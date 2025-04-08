export default class Message {
    public id: string;
    public channelId: string;
    public guildId: string | null;
    public authorId: string;
    public content: string;
    public timestamp: Date;
    public components: any | null;

    constructor(data: any) {
        this.id = data.id;
        this.channelId = data.channel_id;
        this.guildId = data.guild_id || null;
        this.authorId = data.author.id;
        this.content = data.content;
        this.timestamp = data.timestamp;
        this.components = data.components || null;
    }

    repluy(...options: any[]): void {
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
            guild_id: this.guildId,
            author_id: this.authorId,
            content: this.content,
            timestamp: this.timestamp.toISOString(),
            components: this.components.map((row: any) => ({
                type: 1,
                components: row.map((components: any) => components.toJSON())
            }))
        };
    }
}