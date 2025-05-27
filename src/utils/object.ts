export function encodeJson(obj: any) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    return Buffer.from(bytes).toString("base64");
}

export function decodeJson(base64: string) {
    const bytes = Buffer.from(base64, "base64");
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
}