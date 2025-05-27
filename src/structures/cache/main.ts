import Client from "@structures/client/main";
import * as fs from "fs";
import * as path from "path";
import { encodeJson, decodeJson } from "@utils/object";

export default class Cache<V> extends Map<string, V> {
    public readonly client: Client;

    constructor(client: Client) {
        super();

        this.client = client;
    }

    public first(): V | null {
        return this.toArray()[0] ?? null;
    }

    public last(): V | null {
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
        super.set(key, value);
        this.write(key);

        return this;
    }

    public add(key: string, value: V) {
        return this.set(key, value);
    }

    public delete(key: string) {
        this.write(key, true);
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

    protected read(suffix?: string) {
        const cacheRoot = path.resolve(process.cwd(), ".cache");
        if (!fs.existsSync(cacheRoot))
            return;

        const subclassName = this.constructor.name.toLocaleLowerCase();
        const subclassDir = path.join(cacheRoot, subclassName);
        if (!fs.existsSync(subclassDir))
            return;

        let files = fs.readdirSync(subclassDir);
        if (suffix)
            files = files.filter(file => file.endsWith(`.${suffix}`));

        return files.map(file => {
            const filePath = path.join(subclassDir, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            const data = decodeJson(fileContent) as any;
            return data;
        });
    }

    protected write(key: string, remove = false) {
        const cacheRoot = path.resolve(process.cwd(), ".cache");
        if (!fs.existsSync(cacheRoot))
            fs.mkdirSync(cacheRoot);

        const subclassName = this.constructor.name.toLocaleLowerCase();
        const subclassDir = path.join(cacheRoot, subclassName);
        if (!fs.existsSync(subclassDir))
            fs.mkdirSync(subclassDir);

        const value = this.get(key);
        if (!value) return;

        let name = key;
        if (subclassName === "members")
            name = `${key}.${(value as V & { guildId: string }).guildId}`;

        const filePath = path.join(subclassDir, name);
        if (remove) {
            if (fs.existsSync(filePath))
                fs.unlinkSync(filePath);
        } else
            fs.writeFileSync(filePath, encodeJson((value as V & { toJSON: () => any }).toJSON()));

    }
}