import { expect, test } from "bun:test";
import { waitForReady } from "@utils/test";
import { Client } from "@src/main";

const client = new Client({
    intents: ["Guilds"]
});

test("guilds", async () => {
    await waitForReady(client);
    
    expect(client.guilds).toBeInstanceOf(Map);
    expect(client.guilds.size).toBeGreaterThan(0);

    client.destroy();
});