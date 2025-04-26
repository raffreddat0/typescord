import { EventEmitter } from 'events';
import { ClientOptions } from "types/client";
import Guilds from "@structures/cache/guilds";
import User from "@structures/user";
import Guild from "@structures/guild";
import Intents from "./intents";
import WebSocket from "./ws";

export default class Client extends EventEmitter {
    public intents: bigint;
    public instances = {
        "user": User,
        "guild": Guild
    };
    public ready: boolean = false;
    public id: string;
    public user: User = new User(this);
    public guilds: Guilds = new Guilds(this);
    protected token: string;
    #ws: WebSocket;

    constructor(options: ClientOptions) {
        super();

        this.intents = Intents.resolve(options.intents);
        this.token = options.token || process.env.TOKEN;

        for (const instance of (options.instances || [])) {
            const result = Object.entries(this.instances).find(([key, value]) => instance.prototype instanceof value);
            if (result) {
                if (result[0] === "user")
                    this.user = new instance({} as any);
                this.instances[result[0] as keyof typeof this.instances] = instance;
            }
        }

        if (this.token)
            this.#ws = new WebSocket(this, this.token);
    }

    login(token: string): void {
        this.token = token;
        this.#ws = new WebSocket(this, this.token);
    }

    destroy(): void {
        this.#ws.close();
    }

}