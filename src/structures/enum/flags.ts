import type { UserFlags, ChannelFlags, GuildMemberFlags, RoleFlags } from "discord-api-types/v10";
import type { EnumResolvable } from "types/resolvable";
import { Enum } from "@src/main";

type EnumType = typeof UserFlags | typeof ChannelFlags | typeof GuildMemberFlags | typeof RoleFlags;
export default class Flags<T extends EnumType = EnumType> extends Enum<T> {
    constructor(flags: EnumResolvable<T>, enumarator: T) {
        super(flags, enumarator);

        this.freeze();
    }
}