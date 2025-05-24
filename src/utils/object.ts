import { ComponentType, APITextDisplayComponent, APIActionRowComponent, APIMediaGalleryComponent, RESTPostAPIChannelMessageJSONBody, APIMessageTopLevelComponent, APIComponentInMessageActionRow } from "discord-api-types/v10";
import { BaseComponent, Button, Media, Select } from "@src/main";

export type component = string | Button[] | Select[] | Media[];
export type messageOptions = {
    content?: string,
    components?: component[]
}

export function patchMessage(...options: (messageOptions | component)[]) {
    const result: RESTPostAPIChannelMessageJSONBody = {};
    if (options.length === 1 && typeof options[0] === "object") {
        const option = options[0] as messageOptions;
        result.content = option.content;

        if (option.components)
            result.components = patchComponents(...option.components);
    } else
        return patchComponents(...options as component[]);
}

export function patchComponents(...components: component[]) {
    const patched: APIMessageTopLevelComponent[] = [];

    for (const component of components) {
        if (typeof component === "string")
            patched.push({
                type: ComponentType.TextDisplay,
                content: component
            } as APITextDisplayComponent);

        /**
         * for a feature implementation
        if (component instanceof Select)
            component = [component];
        */

        if (component instanceof BaseComponent)
            patched.push(component.toJSON());

        if (Array.isArray(component)) {
            if (component.every(c => c instanceof Button) || component.every(c => c instanceof Select))
                patched.push({
                    type: ComponentType.ActionRow,
                    components: component.map(c => c.toJSON())
                } as APIActionRowComponent<APIComponentInMessageActionRow>);
            if (component.every(c => c instanceof Media))
                patched.push({
                    type: ComponentType.MediaGallery,
                    items: component.map(c => c.toJSON())
                } as APIMediaGalleryComponent);
        }
    }

    return patched;
}