export type EnumResolvable<T extends Record<string, string | number | bigint>> = keyof T | (keyof T)[] | number | bigint;
