import type { EnumResolvable } from "types/enum";
import { inspect } from "util";

export default class Enum<T extends Record<string, string | number>> {
    public readonly enumerator: T;
    private bit: bigint;
    private freezed: boolean;

    constructor(bitfield: EnumResolvable<T>, enumarator: T) {
        this.enumerator = enumarator || {} as T;
        Object.freeze(this.enumerator);

        this.bit = this.resolve(bitfield);
        this.freezed = false;
    }

    get bitfield() {
        return this.bit;
    }

    public add(bitfield: EnumResolvable<T>): void {
        if (this.freezed) return;

        const resolved = this.resolve(bitfield);
        this.bit |= resolved;
    }

    public remove(bitfield: EnumResolvable<T>): void {
        if (this.freezed) return;

        const resolved = this.resolve(bitfield);
        this.bit &= ~resolved;
    }

    public has(bitfield: EnumResolvable<T>): boolean {
        const resolved = this.resolve(bitfield);
        return (this.bit & resolved) === resolved;
    }

    public freeze() {
        this.freezed = true;
    }

    private resolve(bitfield: EnumResolvable<T>) {
        let result = 0n;
        if (typeof bitfield === "bigint" || typeof bitfield === "number") return BigInt(bitfield);
        if (typeof bitfield === "string")
            return BigInt(this.enumerator[bitfield]);

        if (Array.isArray(bitfield))
            for (const bit of bitfield)
                if (typeof bit === "string" && Object.hasOwn(this.enumerator, bit))
                    result |= BigInt(this.enumerator[bit]);
                else if (typeof bit === "number" || typeof bit === "bigint")
                    result |= BigInt(bit);
                else
                    throw new Error("Invalid bitfield");

        else
            throw new Error("Invalid bitfield");

        return result;
    }

    [inspect.custom](depth: number, options: any) {
        return options.stylize(`[${this.constructor.name} ${Number(this.bitfield)}]`, "special");
    }
}
