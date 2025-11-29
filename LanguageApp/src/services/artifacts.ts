// Mock data for review artifacts

export interface VocabularyItem {
    id: string;
    word: string;
    translation: string;
    example: string;
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
    status: 'new' | 'learning' | 'review' | 'mastered';
}

export const mockVocabulary: VocabularyItem[] = [
    { id: '1', word: 'Hola', translation: 'Hello', example: 'Hola, ¿cómo estás?' },
    { id: '2', word: 'Gato', translation: 'Cat', example: 'El gato es negro.' },
    { id: '3', word: 'Perro', translation: 'Dog', example: 'El perro ladra.' },
];

export const mockFlashcards: Flashcard[] = [
    { id: '1', front: 'Hello', back: 'Hola', status: 'mastered' },
    { id: '2', front: 'Cat', back: 'Gato', status: 'learning' },
    { id: '3', front: 'Dog', back: 'Perro', status: 'new' },
];
