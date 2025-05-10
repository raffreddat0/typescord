import { Client } from "@src/main";
import { Message } from "@src/main";

export function waitForReady(client: Client): Promise<void> {
    return new Promise(resolve => {
        if (client.ready)
            resolve();
        else
            client.once("ready", () => resolve());

    });
}

export function waitForMessage(client: Client): Promise<Message> {
    return new Promise(resolve => {
        client.on("messageCreate", (message) => resolve(message));
    });
}