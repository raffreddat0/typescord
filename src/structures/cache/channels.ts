import type { APIUser } from "discord-api-types/v10";
import type { UserResolvable } from "types/user";
import type { FetchUsersOptions, FetchUserOptions } from "types/users";
import { Routes } from "discord-api-types/v10";
import { Client, DMChannel } from "@src/main";
import Cache from "./main";

export default class Channels extends Cache<DMChannel> {
    constructor(client: Client) {
        super(client);
    }

    async fetch(ChannelResolvable: UserResolvable): Promise<DMChannel>;
    async fetch(options: FetchUserOptions): Promise<DMChannel>;
    async fetch(options?: FetchUsersOptions): Promise<this>;
    async fetch(options?: UserResolvable | FetchUserOptions | FetchUsersOptions) {
        let url;

        if (!options)
            return this;

        const resolve = this.resolveId(options as UserResolvable);
        if (resolve) {
            if (this.has(resolve))
                return this.get(resolve);
            url = Routes.user(resolve);
        } else if (typeof options === "object")
            if ("user" in options)
                url = Routes.user(this.resolveId(options.user));

        if (!url)
            throw new Error("Invalid options");

        const data = await this.client.rest.get(url) as APIUser;
        const user = new User(this.client, data);
        this.set(user.id, user);

        return user;
    }

    resolveId(UserResolvable: UserResolvable) {
        if (UserResolvable instanceof User)
            return UserResolvable.id;

        return super.resolveId(UserResolvable);
    }

    resolve(user: UserResolvable) {
        if (user instanceof User)
            return user;

        return super.resolve(user);
    }

    fix(data: APIUser | APIUser[]) {
        if (Array.isArray(data))
            for (const user of data)
                this.fix(user);

        else if (!(data instanceof User)) {
            const fixed = new User(this.client, data);
            this.set(data.id, fixed);
        } else
            this.set(data.id, data);
    }
}