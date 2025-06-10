import type { APIBaseComponent, ComponentType } from "discord-api-types/v10";

export default class BaseComponent<T extends ComponentType> {
    public type: T;

    constructor(data?: APIBaseComponent<T>) {
        this.type = data?.type;
    }

    toJSON() {
        return {
            type: this.type
        } as APIBaseComponent<T>;
    }
}