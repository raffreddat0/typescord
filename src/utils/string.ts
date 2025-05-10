export function camelize(str: string): string {
    return str.toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^([a-z])/, (_, letter) => letter.toLowerCase());
}

export function getTimestamp(snowflake: string): Date {
    const DISCORD_EPOCH = 1420070400000n;
    const id = BigInt(snowflake);
    const timestamp = (id >> 22n) + DISCORD_EPOCH;
    return new Date(Number(timestamp));
}