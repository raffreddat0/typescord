import Client from "@classes/client/main";

export default function guildCreate(client: Client, data: any) {
    console.log("uildgCreate event received");
    if (!client.ready) return;

    client.emit("guildCreate", data);

}