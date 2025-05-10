import { expect, test } from "bun:test";
import { waitForReady } from "@utils/test";
import { Client, Guild } from "@src/main";

const client = new Client({
    intents: ["Guilds"]
});

test("guilds", async () => {
    await waitForReady(client);

    expect(client.guilds).toBeInstanceOf(Map);
    expect(client.guilds.size).toBeGreaterThan(0);
});

test("fetch", async () => {
    await waitForReady(client);

    const guild = await client.guilds.fetch("986619187977912340");
    expect(guild).toBeInstanceOf(Guild);
    expect(guild.id).toBe("986619187977912340");

    client.destroy();
});