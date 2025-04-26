import { APIMessage } from "discord-api-types/v10";
import Client from "@structures/client/main";
import { Message } from "@src/main";

export default function messageCreate(client: Client, data: APIMessage) {
    const message = new Message(client, data);
    console.log(message);
    client.emit("messageCreate", message);
}