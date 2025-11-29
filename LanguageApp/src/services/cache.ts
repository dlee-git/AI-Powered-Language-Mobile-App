// Simple in-memory cache for LLM responses
// In a real app, this might persist to AsyncStorage or MMKV

interface CacheEntry<T> {
    timestamp: number;
    data: T;
}

const cache: Record<string, CacheEntry<unknown>> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export const getCachedResponse = <T>(key: string): T | null => {
    const entry = cache[key];
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
        delete cache[key];
        return null;
    }

    return entry.data as T;
};

export const setCachedResponse = <T>(key: string, data: T) => {
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
