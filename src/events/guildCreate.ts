import { APIGuild } from "discord-api-types/v10";
import Client from "@structures/client/main";
import Guild from "@structures/guild";

export default function guildCreate(client: Client, data: APIGuild) {
    const guild = new Guild(client, data);
    client.guilds.set(guild.id, guild);

    client.emit("guildCreate", guild);
}