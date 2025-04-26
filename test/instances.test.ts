import { expect, test } from "bun:test";
import { waitForReady } from "@utils/test";
import { Client, User } from "@src/main";
import { ClientOptions } from "types/client";

class NewUser extends User {
    public name: string;

    constructor(client: Client, data?: any) {
        super(client, data);
        this.name = data?.username;
    }
}

class NewClient extends Client {
    public user: NewUser = new NewUser(this);
    constructor(options: ClientOptions) {
        super(options);
        this.instances.user = NewUser;
    }
}

const client = new NewClient({
    intents: ["Guilds"]
});

test("user", async () => {
    await waitForReady(client);

    expect(client.user).toBeInstanceOf(User);
    expect(client.user.name).toBeString();

    client.destroy();
});