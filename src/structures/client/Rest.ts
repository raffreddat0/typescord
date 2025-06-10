import axios, { AxiosInstance, Axios } from "axios";
import type { RestOptions } from "types/main";

export default class Rest {
    private readonly path: string;
    private readonly cdn: string;
    private api: AxiosInstance;

    constructor(options: RestOptions) {
        this.path = options.path || "https://discord.com/";
        this.cdn = options.cdn || "https://cdn.discordapp.com";

        this.api = axios.create({
            baseURL: this.path + "api/v10",
            headers: {
                Authorization: `Bot ${options.token}`,
                "content-type": "application/json",
            },
        });

    }

    public async get(url: string) {
        const result = await this.api.get(url);
        return result.data;
    }

    public async post(url: string, body: object) {
        const result = await this.api.post(url, body);
        return result.data;
    }

    public async patch(url: string, body: object) {
        const result = await this.api.patch(url, body);
        return result.data;
    }

    public async put(url: string, body: object) {
        const result = await this.api.put(url, body);
        return result.data;
    }

    public async delete(url: string, body?: object) {
        const result = await this.api.delete(url, body ? { data: body } : undefined);
        return result.data;
    }

    url(url: string, cdn: boolean = false) {
        return cdn ? `${this.cdn}${url}` : `${this.path}${url}`;
    }
}
export { Rest };