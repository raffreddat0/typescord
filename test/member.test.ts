import { expect, test } from "bun:test";
import { waitForReady } from "@utils/test";
import { Client, Guild, Member } from "@src/main";

const client = new Client({
    intents: ["Guilds", "GuildMembers"]
});

test("member", async () => {
    await waitForReady(client);

    const guild = client.guilds.last();
    expect(guild).toBeInstanceOf(Guild);

    const member = guild.members.first();
    expect(member).toBeInstanceOf(Member);

    const username = member.user.username;
    const banner = member.displayBannerURL();

    expect(username).toBeString();
    expect(banner).toBeNull();
});