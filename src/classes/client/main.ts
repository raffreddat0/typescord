import { EventEmitter } from 'events';
import Intents from "./intents";
import WebSocket from "./ws";
import Guilds from "@classes/cache/guilds";

type ClientOptions = {
    intents: string[] | number;
    token?: string;
};

export default class Client extends EventEmitter {
    public intents: bigint;
    public token: string;
    public guilds: Guilds = new Guilds();
    public name: string;
    public ready: boolean = false;
    private ws: WebSocket;

    constructor(options: ClientOptions) {
        super();

        this.intents = Intents.resolve(options.intents);
        this.token = options.token || process.env.TOKEN || undefined;

        if (this.token)
            this.ws = new WebSocket(this);
    }

    login(token: string): void {
        this.token = token;
        this.ws = new WebSocket(this);
    }

}