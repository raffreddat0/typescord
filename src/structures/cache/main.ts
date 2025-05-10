import Client from "@structures/client/main";

export default class Cache<V> extends Map<string, V> {
    public readonly client: Client;

    constructor(client: Client) {
        super();

        this.client = client;
    }

    first(): V | null {
        return this.toArray()[0] ?? null;
    }

    last(): V | null {
        return this.toArray()[this.size - 1] ?? null;
    }

    resolveId(key: string): string | null {
        return (/^\d{18,19}$/).test(key) ? key : null;
    }

    resolve(key: string): V {
        if (this.has(key)) return this.get(key);

        return null;
    }

    set(key: string, value: V & { unavaiable?: boolean }): this {
        if (value?.unavaiable) return this;
        return super.set(key, value);
    }

    add(key: string, value: V): void {
        this.set(key, value);
    }

    remove(key: string): void {
        this.delete(key);
    }

    map(callback: (value: V, key: string) => V): V[] {
        this.forEach((value, key) => {
            this.set(key, callback(value, key));
        });

        return this.toArray();
    }

    filter(callback: (value: V, key: string) => boolean): V[] {
        const result: V[] = [];
        this.forEach((value, key) => {
            if (callback(value, key)) result.push(value);
        });

        return result;
    }

    find(callback: (value: V, key: string) => boolean): V | null {
        for (const [key, value] of this)
            if (callback(value, key)) return value;

        return null;
    }

    toArray(): V[] {
        return Array.from(this.values());
    }

}