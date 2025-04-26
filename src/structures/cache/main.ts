import Client from "@structures/client/main";

export default class Cache<K, V> extends Map<string, V> {
    public readonly client: Client;
    
    constructor(client: Client) {
        super();

        this.client = client;
    }

    resolve(key: string): any {
        if (this.has(key)) return this.get(key);
        return null;
    }

    set(key: string, value: any): this {
        if (value?.unavaiable) return this;
        return super.set(key, value);
    }

    add(key: string, value: V): void {
        this.set(key, value);
    }

    remove(key: string): void {
        this.delete(key);
    }

    map(callback: (value: V, key: string) => void): V[] {
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
        for (const [key, value] of this) {
            if (callback(value, key)) return value;
        }
        
        return null;
    }

    toArray(): V[] {
        return Array.from(this.values());
    }

}