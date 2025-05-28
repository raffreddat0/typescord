import Client from "@structures/client/main";

export default class Cache<V> extends Map<string, V> {
    public readonly client: Client;

    constructor(client: Client) {
        super();

        this.client = client;
    }

    public first() {
        return this.toArray()[0] ?? null;
    }

    public last() {
        return this.toArray()[this.size - 1] ?? null;
    }

    public resolveId(key: string): string | null {
        return (/^\d{18,19}$/).test(key) ? key : null;
    }

    public resolve(key: string) {
        if (this.has(key)) return this.get(key);

        return null;
    }

    public set(key: string, value: V & { unavaiable?: boolean }) {
        if (value?.unavaiable) return this;
        return super.set(key, value);
    }

    public add(key: string, value: V) {
        return this.set(key, value);
    }

    public delete(key: string) {
        return super.delete(key);
    }

    public remove(key: string) {
        return this.delete(key);
    }

    public map(callback: (value: V, key: string) => V) {
        this.forEach((value, key) => {
            this.set(key, callback(value, key));
        });

        return this.toArray();
    }

    public filter(callback: (value: V, key: string) => boolean) {
        const result: V[] = [];
        this.forEach((value, key) => {
            if (callback(value, key)) result.push(value);
        });

        return result;
    }

    public find(callback: (value: V, key: string) => boolean) {
        for (const [key, value] of this)
            if (callback(value, key)) return value;

        return null;
    }

    public toArray() {
        return Array.from(this.values());
    }
}