import { expect, test } from "bun:test";
import { Client } from "@src/main";

const client = new Client({
    intents: ["Guilds"]
});

test("guilds", () => {
    client.on("ready", () => {
        expect(client.guilds).toBeInstanceOf(Map);
        expect(client.guilds.size).toBeGreaterThan(0);
    })
});