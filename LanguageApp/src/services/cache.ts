// Simple in-memory cache for LLM responses
// In a real app, this might persist to AsyncStorage or MMKV

interface CacheEntry {
    timestamp: number;
    data: any;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export const getCachedResponse = (key: string) => {
    const entry = cache[key];
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
        delete cache[key];
        return null;
    }

    return entry.data;
};

export const setCachedResponse = (key: string, data: any) => {
    cache[key] = {
        timestamp: Date.now(),
        data,
    };
};

export const clearCache = () => {
    for (const key in cache) {
        delete cache[key];
    }
};
