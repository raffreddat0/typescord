type FlagResolvable = string | string[] | number | bigint;
export default class Flags {
    public readonly flags: any;
    private bit: bigint;
    private freezed: boolean;

    constructor(flags: string[] | number | bigint, enumarator: any) {
        this.bit = this.resolve(flags);
        this.freezed = false;

        this.flags = enumarator || this.flags || {};
        Object.freeze(this.flags);
    }

    private resolve(flags: FlagResolvable): bigint {
        let result = 0n;
        if (typeof flags === "bigint" || typeof flags === "number") return BigInt(flags);
        if (typeof flags === "string")
            return BigInt(this.flags[flags]);

        if (Array.isArray(flags))
            for (const flag of flags)
                if (typeof flag === "string" && Object.prototype.hasOwnProperty.call(this.flags, flag))
                    result |= BigInt(this.flags[flag]);
                else if (typeof flag === "number" || typeof flag === "bigint")
                    result |= BigInt(flag);
                else
                    throw new Error("Invalid flag");

        else
            throw new Error("Invalid flag");

        return result;
    }

    public add(intents: FlagResolvable): void {
        if (this.freezed) return;

        const resolved = this.resolve(intents);
        this.bit |= resolved;
    }

    public remove(intents: FlagResolvable): void {
        if (this.freezed) return;

        const resolved = this.resolve(intents);
        this.bit &= ~resolved;
    }

    public has(intents: FlagResolvable): boolean {
        const resolved = this.resolve(intents);
        return (this.bit & resolved) === resolved;
    }

    public freeze(): void {
        this.freezed = true;
    }

    get bitfield(): bigint {
        return this.bit;
    }
}
