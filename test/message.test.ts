import { expect, test } from "bun:test";
import { waitForMessage } from "@utils/test";
import { Client, Message } from "@src/main";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"]
});

test("message", async () => {
    const message = await waitForMessage(client);
    
    expect(message).toBeInstanceOf(Message);
    expect(message.id).toBeString();

    client.destroy();
});