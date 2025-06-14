import WebSocketClient from "ws";
import { camelize } from "@utils/string";
import { Client, User } from "@src/main";

export default class WebSocket extends WebSocketClient {
    private readonly token: string;
    public intents: bigint;
    public client: Client;

    constructor(client: Client, token: string) {
        super("wss://gateway.discord.gg/?v=10&encoding=json");
        this.token = token;
        this.intents = client.intents.bitfield;
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
            if (code === 1000) return;
            console.error(`WebSocket chiuso. Codice: ${code}, Motivo: ${reason}`);
        });

        let cached = 0;
        this.on("message", async (data: string) => {
            const payload = JSON.parse(data);
            const { t, op, d, s } = payload;

            this.emit("response", d);
            this.client.emit("raw", payload);

            if (t === "READY") {
                this.client.id = d.user.id;
                this.client.user = new User(this.client, d.user);
                cached = d.guilds.length;
                if (cached === 0) {
                    this.client.ready = true;
                    this.client.emit("ready", this.client);
                }
                return;
            }

            if (t === "GUILD_CREATE" && cached > 0) {
                if (this.client.options.cache.guilds)
                    await this.client.guilds.fix(d);

                cached--;

                if (cached === 0) {
                    this.client.ready = true;
                    this.client.emit("ready", this.client);
                }
                return;
            }

            if (d?.unavaiable) return;

            if (op === 0 && (this.client.ready))
                (await import("@events/" + camelize(t))).default(this.client, d);

            if (op === 10) {
                const { heartbeat_interval } = d;
                this.heartbeat(s, heartbeat_interval);
            }
        });
    }

    private heartbeat(s: number, heartbeat: number) {
        this.send(JSON.stringify({ op: 1, d: s }));
        setTimeout(() => {
            this.heartbeat(s, heartbeat);
        }, heartbeat);
    }
}