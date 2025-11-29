import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyItem, Flashcard, ChatMessage, LanguageCode, DifficultyLevel } from '../types';
import {
    getVocabulary, addVocabularyItem,
    getFlashcards, addFlashcard, updateFlashcardStatus,
    getConversationHistory, addMessage, clearConversationHistory,
    deleteVocabularyItem, deleteFlashcardItem
} from '../services/database';

interface AppState {
    // Preferences
    userLanguage: LanguageCode;
    targetLanguage: LanguageCode;
    difficultyLevel: DifficultyLevel;
    theme: 'light' | 'dark' | 'system';
    setLanguage: (type: 'user' | 'target', lang: LanguageCode) => void;
    setDifficulty: (level: DifficultyLevel) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;

    // Data
    vocabulary: VocabularyItem[];
    flashcards: Flashcard[];
    history: ChatMessage[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadData: () => Promise<void>;

    // Vocab Actions
    addVocabulary: (word: string, translation: string, example: string) => Promise<void>;
    deleteVocabulary: (id: number) => Promise<void>;

    // Flashcard Actions
    addFlashcardItem: (front: string, back: string) => Promise<void>;
    deleteFlashcard: (id: number) => Promise<void>;
    updateFlashcard: (id: number, status: 'new' | 'learning' | 'mastered') => Promise<void>;

    // History Actions
    addChatMessage: (role: 'user' | 'assistant' | 'system', content: string) => Promise<void>;
    clearHistory: () => Promise<void>;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            userLanguage: 'en',
            targetLanguage: 'es',
            difficultyLevel: 'A1',
            theme: 'system',
            vocabulary: [],
            flashcards: [],
            history: [],
            isLoading: false,
            error: null,

            // Preferences Actions
            setLanguage: (type, lang) =>
                set((state) => ({
                    ...state,
                    [type === 'user' ? 'userLanguage' : 'targetLanguage']: lang,
                })),
            setDifficulty: (level) => set({ difficultyLevel: level }),
            setTheme: (theme) => set({ theme }),

            // Data Actions
            loadData: async () => {
                set({ isLoading: true, error: null });
                try {
                    const [vocab, cards, hist] = await Promise.all([
                        getVocabulary(),
                        getFlashcards(),
                        getConversationHistory()
                    ]);
                    set({
                        vocabulary: vocab as VocabularyItem[],
                        flashcards: cards as Flashcard[],
                        history: hist as ChatMessage[],
                        isLoading: false
                    });
                } catch (error) {
                    set({ error: 'Failed to load data', isLoading: false });
                    console.error(error);
                }
            },

            addVocabulary: async (word, translation, example) => {
                try {
                    const id = await addVocabularyItem(word, translation, example);
                    const newItem: VocabularyItem = { id, word, translation, example };
                    set((state) => ({ vocabulary: [newItem, ...state.vocabulary] }));
                } catch (error) {
                    set({ error: 'Failed to add vocabulary' });
                    console.error(error);
                }
            },

            deleteVocabulary: async (id) => {
                try {
                    await deleteVocabularyItem(id);
                    set((state) => ({
                        vocabulary: state.vocabulary.filter((item) => item.id !== id),
                    }));
                } catch (error) {
                    set({ error: 'Failed to delete vocabulary' });
                    console.error(error);
                }
            },

            addFlashcardItem: async (front, back) => {
                try {
                    const id = await addFlashcard(front, back, 'new');
                    const newItem: Flashcard = { id, front, back, status: 'new' };
                    set((state) => ({ flashcards: [newItem, ...state.flashcards] }));
                } catch (error) {
                    set({ error: 'Failed to add flashcard' });
                    console.error(error);
                }
            },

            deleteFlashcard: async (id) => {
                try {
                    await deleteFlashcardItem(id);
                    set((state) => ({
                        flashcards: state.flashcards.filter((item) => item.id !== id),
                    }));
                } catch (error) {
                    set({ error: 'Failed to delete flashcard' });
                    console.error(error);
                }
            },

            updateFlashcard: async (id, status) => {
                try {
                    await updateFlashcardStatus(id, status);
                    set((state) => ({
                        flashcards: state.flashcards.map((card) =>
                            card.id === id ? { ...card, status } : card
                        ),
                    }));
                } catch (error) {
                    set({ error: 'Failed to update flashcard' });
                    console.error(error);
                }
            },

            addChatMessage: async (role, content) => {
                try {
                    const id = await addMessage(role, content);
                    const newItem: ChatMessage = { id, role, content, timestamp: Date.now() };
                    set((state) => ({ history: [...state.history, newItem] }));
                } catch (error) {
                    set({ error: 'Failed to save message' });
                    console.error(error);
                }
            },

            clearHistory: async () => {
                try {
                    await clearConversationHistory();
                    set({ history: [] });
                } catch (error) {
                    set({ error: 'Failed to clear history' });
                    console.error(error);
                }
            },
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                userLanguage: state.userLanguage,
                targetLanguage: state.targetLanguage,
                difficultyLevel: state.difficultyLevel,
                theme: state.theme
            }), // Only persist preferences to AsyncStorage, data comes from SQLite
        }
    )
);
