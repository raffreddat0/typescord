import WebSocketClient from "ws";
import { camelize } from "@utils/string"; 
import Client from "./main";

const cache = new Map<string, any>();
export default class WebSocket extends WebSocketClient {
    private readonly token: string;
    public intents: bigint;
    public client: Client;
    
    constructor(client: Client) {
        super("wss://gateway.discord.gg/?v=10&encoding=json");
        this.intents = client.intents;
        this.token = client.token;
        this.client = client;
        this.open();
    }
    
    public open() {
        const headers = {
            op: 2,
            d: {
                token: this.token,
                intents: Number(this.intents),
                properties: {
                    os: "linux",
                    browser: "chrome",
                    device: "chrome",
                },
            },
        };
    
        this.on("open", () => {
            this.send(JSON.stringify(headers));
        });

        this.on("close", (code, reason) => {
            console.error(`WebSocket chiuso. Codice: ${code}, Motivo: ${reason}`);
        });
        
        let cached = 0;
        this.on("message", async (data: any) => {
        const payload = JSON.parse(data);
        const { t, op, d, s } = payload;

        this.emit("response", d);
        this.client.emit("raw", payload);

        if (t === "READY") {
            this.client.name = d.user.username;
            cached = d.guilds.length;
            if (cached === 0) {
                this.client.ready = true;
                this.client.emit("ready", this.client);
            }
            return;
        }

        if (t === "GUILD_CREATE" && cached > 0) {
            cached--;
            this.client.guilds.fix(d);

            if (cached === 0) {
                this.client.ready = true;
                this.client.emit("ready", this.client);
            }
            return;
        }
    
        if (d?.unavaiable) return;
    
        // console.log(t, op);
    
        if (op === 0 && (this.client.ready)) {
            (await import("@events/" + camelize(t))).default(this.client, d);
        }
    
        if (op === 10) {
            const { heartbeat_interval } = d;
            this.heartbeat(s, heartbeat_interval);
        }
        });
    }
    
    heartbeat(s: any, heartbeat: number) {
        this.send(JSON.stringify({ op: 1, d: s }));
        setTimeout(() => {
            this.heartbeat(s, heartbeat);
        }, heartbeat);
    }
}