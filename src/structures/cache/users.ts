import { APIUser, ChannelType } from "discord-api-types/v10";
import type { UserResolvable } from "types/user";
import type { FetchUsersOptions, FetchUserOptions } from "types/users";
import { Routes } from "discord-api-types/v10";
import { Client, User, DMChannel } from "@src/main";
import Cache from "./main";

export default class Users extends Cache<User> {
    constructor(client: Client) {
        super(client);
    }

    dmChannel(resolvable: UserResolvable) {
        const id = this.resolveId(resolvable);
        if (!id)
            throw new Error("Invalid UserResolvable");

        return this.client.channels.find(channel => channel.type === ChannelType.DM && channel.userId === id) ?? null;
    }

    async createDM(resolvable: UserResolvable) {
        const id = this.resolveId(resolvable);
        if (!id)
            throw new Error("Invalid UserResolvable");

        let channel = this.dmChannel(resolvable);
        if (channel)
            return channel;

        const dm = await this.client.rest.post(Routes.userChannels(), {
            body: {
                recipient_id: id
            }
        });

        channel = new DMChannel(this.client, dm);
        this.client.channels.set(channel.id, channel);

        return channel;
    }

    async deleteDM(resolvable: UserResolvable) {
        const id = this.resolveId(resolvable);
        if (!id)
            throw new Error("Invalid UserResolvable");

        const channel = this.dmChannel(resolvable);
        if (!channel)
            throw new Error("DMChannel not found");

        await this.client.rest.delete(Routes.channel(channel.id));
        this.client.channels.delete(channel.id);

        return channel;
    }

    async fetch(resolvable: UserResolvable): Promise<User>;
    async fetch(options: FetchUserOptions): Promise<User>;
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

    resolveId(resolvable: UserResolvable) {
        if (resolvable instanceof User)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    resolve(resolvable: UserResolvable) {
        if (resolvable instanceof User)
            return resolvable;

        return super.resolve(resolvable);
    }

    fix(data: User | APIUser | APIUser[]) {
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