import { APIUser, ChannelType } from "discord-api-types/v10";
import type { UserResolvable } from "types/resolvable";
import type { FetchUserOptions } from "types/fetch";
import { Routes } from "discord-api-types/v10";
import { Cache, Client, User, DMChannel } from "@src/main";

export default class Users extends Cache<User> {
    constructor(client: Client) {
        super(client);
    }

    public dmChannel(resolvable: UserResolvable) {
        const id = this.resolveId(resolvable);
        if (!id)
            throw new Error("Invalid UserResolvable");

        return this.client.channels.find(channel => channel.type === ChannelType.DM && channel.userId === id) ?? null;
    }

    public async createDM(resolvable: UserResolvable) {
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

    public async deleteDM(resolvable: UserResolvable) {
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

    fetch(resolvable: UserResolvable): Promise<User>;
    fetch(options: FetchUserOptions): Promise<User>;
    fetch(): Promise<this>;
    public async fetch(options?: UserResolvable | FetchUserOptions) {
        let url: string;

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

    public resolveId(resolvable: UserResolvable) {
        if (resolvable instanceof User)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    public resolve(resolvable: UserResolvable) {
        if (resolvable instanceof User)
            return resolvable;

        return super.resolve(resolvable);
    }

    public async fix(data: User | APIUser | APIUser[]) {
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