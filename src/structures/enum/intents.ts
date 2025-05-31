import { GatewayIntentBits } from "discord-api-types/v10";
import type { EnumResolvable } from "types/resolvable";
import { Enum } from "@src/main";

type EnumType = typeof GatewayIntentBits;
export default class Intents<T extends EnumType = EnumType> extends Enum<T> {
    constructor(intents: EnumResolvable<T>, enumarator = GatewayIntentBits as T) {
        super(intents, enumarator);

        this.freeze();
    }
}