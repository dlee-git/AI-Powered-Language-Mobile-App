export interface VocabularyItem {
    id: number;
    word: string;
    translation: string;
    example?: string;
}

export interface Flashcard {
    id: number;
    front: string;
    back: string;
    status: 'new' | 'learning' | 'mastered';
}

export interface ChatMessage {
    id?: number; // Optional because it might not be saved yet
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: number;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ru';

export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface UserPreferences {
    userLanguage: LanguageCode;
    targetLanguage: LanguageCode;
    difficultyLevel: DifficultyLevel;
    theme: 'light' | 'dark' | 'system';
}
