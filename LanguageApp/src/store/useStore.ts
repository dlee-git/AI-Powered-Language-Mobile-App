import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
    userLanguage: string; // L1 (Native)
    targetLanguage: string; // L2 (Target)
    difficultyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
    setLanguage: (type: 'user' | 'target', lang: string) => void;
    setDifficulty: (level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1') => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            userLanguage: 'en',
            targetLanguage: 'es',
            difficultyLevel: 'A1',
            setLanguage: (type, lang) =>
                set((state) => ({
                    ...state,
                    [type === 'user' ? 'userLanguage' : 'targetLanguage']: lang,
                })),
            setDifficulty: (level) => set({ difficultyLevel: level }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
