import { GatewayIntentBits } from "discord-api-types/v10";
import type { ClientOptions } from "types/client";
import { EventEmitter } from "events";
import { Users, Guilds, User, Channels, DMChannel, Flags } from "@src/main";
import WebSocket from "./ws";
import Rest from "./rest";

export default class Client extends EventEmitter {
    public intents: Flags;
    public ready: boolean = false;
    public id: string;
    public user: User;
    public users: Users;
    public guilds: Guilds;
    public channels: Channels<DMChannel>;
    public rest: Rest;
    public options: Omit<ClientOptions, "intents" | "token">;
    protected token: string;
    private ws: WebSocket;

    constructor(options: ClientOptions) {
        super();

        const { intents, token, ...rest } = options;

        this.intents = new Flags(intents, GatewayIntentBits);
        this.token = token || process.env.TOKEN;

        this.options = rest;
        this.options.cache = {
            users: rest.cache?.users ?? true,
            guilds: rest.cache?.guilds ?? true,
            members: rest.cache?.members ?? true,
        };

        this.user = new User(this);
        this.users = new Users(this);
        this.guilds = new Guilds(this);
        this.channels = new Channels(this);

        if (this.options.cache.users)
            this.users.fetch();

        if (this.token)
            this.login(this.token);
    }

    public login(token: string) {
        this.token = token;
        this.ws = new WebSocket(this, this.token);
        this.rest = new Rest({ token: this.token });
        if (this.options.cache.members)
            this.guilds.forEach((guild) => guild.members.fetch());
    }

    public destroy() {
        this.ws.close();
    }
}