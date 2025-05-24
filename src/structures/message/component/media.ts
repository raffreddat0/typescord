import { APIMediaGalleryItem } from "discord-api-types/v10";

export default class Media {
    public url: string;
    public height: number;
    public width: number;
    public contentType: string;
    public description: string;
    public spoiler: boolean;

    constructor(data?: APIMediaGalleryItem) {
        this.url = data.media.url;
        this.height = data.media.height;
        this.width = data.media.width;
        this.contentType = data.media.content_type;
        this.description = data.description;
        this.spoiler = data.spoiler ?? false;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setSpoiler(spoiler: boolean) {
        this.spoiler = spoiler;
        return this;
    }

    toJSON(): APIMediaGalleryItem {
        return {
            media: {
                url: this.url,
                height: this.height,
                width: this.width,
                content_type: this.contentType
            },
            description: this.description,
            spoiler: this.spoiler
        };
    }
}