import { inspect } from "util";
import Client from "@structures/client/Client";

export default class Base {
    protected readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    [inspect.custom]() {
        const { client, ...rest } = this;
        return rest;
    }
}