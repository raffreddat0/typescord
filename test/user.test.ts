import { expect, test } from "bun:test";
import { waitForReady } from "@utils/test";
import { Client, User } from "@src/main";

const client = new Client({
    intents: ["Guilds"]
});

test("user", async () => {
    await waitForReady(client);
    
    expect(client.user).toBeInstanceOf(User);
    expect(client.user.id).toBeString();

    client.destroy();
});