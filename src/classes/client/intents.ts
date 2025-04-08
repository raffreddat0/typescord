
import { GatewayIntentBits } from "discord-api-types/v10"
export default class Intents {
    static FLAGS = GatewayIntentBits;
    private bytes: bigint;
    
    constructor(intents: string[] | number | bigint) {
        this.bytes = Intents.resolve(intents);
    }

    static resolve(intents: string | string[] | number | bigint): bigint {
        let result = 0n;
        if (typeof intents === "bigint" || typeof intents === "number") return BigInt(intents);
        if (typeof intents === "string")
            return BigInt(Intents.FLAGS[intents as any]);

        if (Array.isArray(intents)) {
            for (const intent of intents) {
                if (typeof intent === "string" && this.FLAGS.hasOwnProperty(intent)) {
                    result |= BigInt(this.FLAGS[intent as any]);
                } else if (typeof intent === "number" || typeof intent === "bigint") {
                    result |= BigInt(intent);
                } else {
                    throw new Error("Invalid intents");
                }
            }
        } else {
            throw new Error("Invalid intent");
        }
        return result;
    }

    add(intents: string | string[] | number | bigint): void {
        const resolved = Intents.resolve(intents);
        this.bytes |= resolved;
    }

    remove(intents: string | string[] | number | bigint): void {
        const resolved = Intents.resolve(intents);
        this.bytes &= ~resolved;
    }
    
    has(intents: string | string[] | number | bigint): boolean {
        const resolved = Intents.resolve(intents);
        return (this.bytes & resolved) === resolved;
    }

    toNumber(): number {
        return Number(this.bytes);
    }

    toBigInt(): bigint {
        return this.bytes;
    }
}
