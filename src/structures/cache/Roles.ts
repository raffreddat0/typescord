import { APIRole, Routes } from "discord-api-types/v10";
import type { RoleResolvable, FetchRoleOptions } from "types/main";
import { Cache, Client, Role, Guild } from "@src/main";

export default class Roles extends Cache<Role> {
    private guild: Guild;

    constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    fetch(resolvable: RoleResolvable): Promise<Role>;
    fetch(options: FetchRoleOptions): Promise<Role>;
    fetch(): Promise<this>;
    public async fetch(options?: RoleResolvable | FetchRoleOptions) {
        let url: string;

        if (!options)
            url = Routes.guildRoles(this.guild.id);
        else {
            const resolve = this.resolveId(options as RoleResolvable);
            if (resolve) {
                if (this.has(resolve))
                    return this.get(resolve);
                url = Routes.guildRole(this.guild.id, resolve);
            } else if (typeof options === "object")
                if ("role" in options)
                    url = Routes.guildRole(this.guild.id, this.resolveId(options.role));
        }

        if (!url)
            throw new Error("Invalid options");

        const data = await this.client.rest.get(url);
        if (Array.isArray(data)) {
            await this.fix(data);
            return this;
        }

        const role = new Role(this.client, this.guild, data);
        this.set(role.id, role);

        return role;
    }

    public resolveId(resolvable: RoleResolvable) {
        if (resolvable instanceof Role)
            return resolvable.id;

        return super.resolveId(resolvable);
    }

    public resolve(resolvable: RoleResolvable) {
        if (resolvable instanceof Role)
            return resolvable;

        return super.resolve(resolvable);
    }

    public async fix(data: Role | Role[] | APIRole | APIRole[]) {
        if (!data)
            return;

        if (Array.isArray(data))
            for (const role of data)
                this.fix(role);

        else if (!(data instanceof Role)) {
            const fixed = new Role(this.client, this.guild, data);
            this.set(data.id, fixed);
        } else
            this.set(data.id, data);
    }
}