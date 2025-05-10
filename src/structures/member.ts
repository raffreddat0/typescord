import type { APIGuildMember } from "discord-api-types/v10";
import { Client, User, Base } from "@src/main";

export default class Member extends Base {
    public id: string;
    public user: User;

    constructor(client: Client, data?: APIGuildMember) {
        super(client);

        if (!data) return;
        this.id = data.user.id;
        this.user = new User(this.client, data.user);
    }
}