import { useStore } from '../src/store/useStore';
import * as database from '../src/services/database';

// Mock the database service
jest.mock('../src/services/database', () => ({
    getVocabulary: jest.fn(),
    getFlashcards: jest.fn(),
    getConversationHistory: jest.fn(),
    addVocabularyItem: jest.fn(),
    addFlashcard: jest.fn(),
    updateFlashcardStatus: jest.fn(),
    addMessage: jest.fn(),
    clearConversationHistory: jest.fn(),
}));

describe('useStore', () => {
    beforeEach(() => {
        useStore.setState({
            vocabulary: [],
            flashcards: [],
            history: [],
            isLoading: false,
            error: null,
            userLanguage: 'en',
            targetLanguage: 'es',
            difficultyLevel: 'A1',
        });
        jest.clearAllMocks();
    });

    it('should set language preferences', () => {
        const { setLanguage } = useStore.getState();
        setLanguage('user', 'fr');
        expect(useStore.getState().userLanguage).toBe('fr');
        setLanguage('target', 'de');
        expect(useStore.getState().targetLanguage).toBe('de');
    });

    it('should set difficulty level', () => {
        const { setDifficulty } = useStore.getState();
        setDifficulty('B2');
        expect(useStore.getState().difficultyLevel).toBe('B2');
    });

    it('should load data from database', async () => {
        (database.getVocabulary as jest.Mock).mockResolvedValue([{ id: 1, word: 'test', translation: 'prueba' }]);
        (database.getFlashcards as jest.Mock).mockResolvedValue([]);
        (database.getConversationHistory as jest.Mock).mockResolvedValue([]);

        const { loadData } = useStore.getState();
        await loadData();

        expect(useStore.getState().vocabulary).toHaveLength(1);
        expect(useStore.getState().vocabulary[0].word).toBe('test');
        expect(useStore.getState().isLoading).toBe(false);
    });

    it('should add vocabulary item', async () => {
        (database.addVocabularyItem as jest.Mock).mockResolvedValue(123);
        const { addVocabulary } = useStore.getState();

        await addVocabulary('hello', 'hola', 'hello world');

        expect(database.addVocabularyItem).toHaveBeenCalledWith('hello', 'hola', 'hello world');
        expect(useStore.getState().vocabulary).toHaveLength(1);
        expect(useStore.getState().vocabulary[0].id).toBe(123);
    });

    it('should handle errors gracefully', async () => {
        (database.addVocabularyItem as jest.Mock).mockRejectedValue(new Error('DB Error'));
        const { addVocabulary } = useStore.getState();

        await addVocabulary('fail', 'fallo', '');

        expect(useStore.getState().error).toBe('Failed to add vocabulary');
    });
});
