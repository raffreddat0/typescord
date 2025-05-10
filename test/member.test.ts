import { expect, test } from "bun:test";
import { waitForReady } from "@utils/test";
import { Client, Guild, Member } from "@src/main";

const client = new Client({
    intents: ["Guilds", "GuildMembers"]
});

test("members", async () => {
    await waitForReady(client);

    const guild = client.guilds.first();
    expect(guild).toBeInstanceOf(Guild);
});