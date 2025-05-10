import type { APIGuildMember } from "discord-api-types/v10";
import type { MemberResolvable } from "types/member";
import type { FetchMemberOptions, FetchMembersOptions } from "types/members";
import { Routes } from "discord-api-types/v10";
import { Client, Member } from "@src/main";
import Cache from "./main";

export default class Members extends Cache<Member> {
    private guildId: string;

    constructor(client: Client, guildId: string) {
        super(client);

        this.guildId = guildId;
    }

    async fetch(resolvable: MemberResolvable): Promise<Member>;
    async fetch(options: FetchMemberOptions): Promise<Member>;
    async fetch(options?: FetchMembersOptions): Promise<this>;
    async fetch(options?: MemberResolvable | FetchMemberOptions | FetchMembersOptions) {
        let url, multiple = false;

        if (!options)
            url = Routes.guildMembers(this.guildId);
        else {
            const resolve = this.resolveId(options as MemberResolvable);
            if (resolve) {
                if (this.has(resolve))
                    return this.get(resolve);
                url = Routes.guildMember(this.guildId, resolve);
            } else if (typeof options === "object")
                if ("member" in options)
                    url = Routes.guildMember(this.guildId, this.resolveId(options.member));
                else if ("after" in options || "limit" in options) {
                    url = Routes.guildMembers(this.guildId);
                    if ("after" in options)
                        url += `?after=${options.after}`;
                    if ("limit" in options)
                        url += `?limit=${options.limit}`;
                    multiple = true;
                }
        }

        if (!url)
            throw new Error("Invalid options");

        const data = await this.client.rest.get(url) as APIGuildMember | APIGuildMember[];

        if (multiple) {
            this.fix(data);
            return this;
        }

        const member = new Member(this.client, data as APIGuildMember);
        this.set(member.id, member);

        return member;
    }

    resolveId(resolvable: MemberResolvable) {
        if (resolvable instanceof Member)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    resolve(resolvable: MemberResolvable) {
        if (resolvable instanceof Member)
            return resolvable;

        return super.resolve(resolvable);
    }

    fix(data: APIGuildMember | APIGuildMember[]) {
        if (Array.isArray(data))
            for (const member of data)
                this.fix(member);

        else if (!(data instanceof Member)) {
            const fixed = new Member(this.client, data);
            this.set(data.user.id, fixed);
        } else
            this.set(data.id, data);
    }
}