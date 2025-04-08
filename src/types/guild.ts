export interface GuildData {
    id: string;
    name: string;
    icon: string | null;
    splash: string | null;
    discoverySplash: string | null;
    features: string[];
    mfaLevel: number;
}

