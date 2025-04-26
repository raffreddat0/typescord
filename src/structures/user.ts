import { APIUser } from "discord-api-types/v10";
import Client from "@structures/client/main";
import Base from "@structures/base";

export default class User extends Base {
    public id: string;
    public username: string;
    public avatar: string | null;
    public banner: string | null;

    constructor(client: Client, data?: APIUser) {
        super(client);

        if (!data) return;
        this.id = data.id;
        this.username = data.username;
        this.avatar = data.avatar ?? null;
        this.banner = data.banner ?? null;
    }
}