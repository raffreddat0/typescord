import type { APIGuildMember } from "discord-api-types/v10";
import type { MemberResolvable } from "types/member";
import type { FetchMemberOptions, FetchMembersOptions } from "types/members";
import { Routes } from "discord-api-types/v10";
import { Client, Member, Guild } from "@src/main";
import Cache from "./main";

export default class Members extends Cache<Member> {
    private guild: Guild;

    constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
        this.load();
    }

    async fetch(resolvable: MemberResolvable): Promise<Member>;
    async fetch(options: FetchMemberOptions): Promise<Member>;
    async fetch(options?: FetchMembersOptions): Promise<this>;
    async fetch(options?: MemberResolvable | FetchMemberOptions | FetchMembersOptions) {
        let url;

        if (!options)
            url = Routes.guildMembers(this.guild.id);
        else {
            const resolve = this.resolveId(options as MemberResolvable);
            if (resolve) {
                if (this.has(resolve))
                    return this.get(resolve);
                url = Routes.guildMember(this.guild.id, resolve);
            } else if (typeof options === "object")
                if ("member" in options)
                    url = Routes.guildMember(this.guild.id, this.resolveId(options.member));
                else if ("after" in options || "limit" in options) {
                    url = Routes.guildMembers(this.guild.id);
                    if ("after" in options)
                        url += `?after=${options.after}`;
                    if ("limit" in options)
                        url += `?limit=${options.limit}`;
                }
        }

        if (!url)
            throw new Error("Invalid options");

        const data = await this.client.rest.get(url) as APIGuildMember | APIGuildMember[];
        if (Array.isArray(data)) {
            this.fix(data);
            return this;
        }

        const member = new Member(this.client, this.guild, data);
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

    fix(data: Member | Member[] | APIGuildMember | APIGuildMember[]) {
        if (!data)
            return;

        if (Array.isArray(data))
            for (const member of data)
                this.fix(member);

        else if (!(data instanceof Member)) {
            const fixed = new Member(this.client, this.guild, data);
            this.set(data.user.id, fixed);
        } else
            this.set(data.id, data);
    }

    load() {
        const data = super.read(this.guild.id);
        return this.fix(data);
    }
}