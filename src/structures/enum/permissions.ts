import type { PermissionFlagsBits } from "discord-api-types/v10";
import type { EnumResolvable } from "types/enum";
import { Enum } from "@src/main";

type EnumType = typeof PermissionFlagsBits;
export default class Permissions<T extends EnumType = EnumType> extends Enum<T> {
    constructor(permissions: EnumResolvable<T>, enumarator: T) {
        super(permissions, enumarator);

        this.freeze();
    }
}