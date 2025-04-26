export function camelize(str: string): string {
    return str.toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^([a-z])/, (_, letter) => letter.toLowerCase());
}