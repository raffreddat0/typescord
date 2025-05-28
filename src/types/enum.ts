export type EnumResolvable<T extends Record<string, string | number>> = keyof T | (keyof T)[] | number | bigint;
