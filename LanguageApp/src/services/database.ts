import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync('language_app.db');

        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        translation TEXT NOT NULL,
        example TEXT
      );

      CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        status TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );
    `);

        // Seed data if empty (for testing)
        const vocabCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM vocabulary');
        if (vocabCount && vocabCount.count === 0) {
            await db.runAsync('INSERT INTO vocabulary (word, translation, example) VALUES (?, ?, ?)', 'Hola', 'Hello', 'Hola, ¿cómo estás?');
            await db.runAsync('INSERT INTO vocabulary (word, translation, example) VALUES (?, ?, ?)', 'Gato', 'Cat', 'El gato es negro.');
        }

        const flashcardCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM flashcards');
        if (flashcardCount && flashcardCount.count === 0) {
            await db.runAsync('INSERT INTO flashcards (front, back, status) VALUES (?, ?, ?)', 'Hello', 'Hola', 'mastered');
            await db.runAsync('INSERT INTO flashcards (front, back, status) VALUES (?, ?, ?)', 'Cat', 'Gato', 'learning');
        }

        console.log('Database initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize database', error);
        return false;
    }
};

export const getDatabase = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
};

// Vocabulary Operations
export const addVocabularyItem = async (word: string, translation: string, example: string) => {
    const result = await db.runAsync(
        'INSERT INTO vocabulary (word, translation, example) VALUES (?, ?, ?)',
        word, translation, example
    );
    return result.lastInsertRowId;
};

export const getVocabulary = async () => {
    return await db.getAllAsync('SELECT * FROM vocabulary ORDER BY id DESC');
};

// Flashcard Operations
export const addFlashcard = async (front: string, back: string, status: string = 'new') => {
    const result = await db.runAsync(
        'INSERT INTO flashcards (front, back, status) VALUES (?, ?, ?)',
        front, back, status
    );
    return result.lastInsertRowId;
};

export const getFlashcards = async () => {
    return await db.getAllAsync('SELECT * FROM flashcards ORDER BY id DESC');
};

export const updateFlashcardStatus = async (id: number, status: string) => {
    await db.runAsync(
        'UPDATE flashcards SET status = ? WHERE id = ?',
        status, id
    );
};

// Conversation Operations
export const addMessage = async (role: string, content: string) => {
    const timestamp = Date.now();
    const result = await db.runAsync(
        'INSERT INTO conversations (role, content, timestamp) VALUES (?, ?, ?)',
        role, content, timestamp
    );
    return result.lastInsertRowId;
};

export const getConversationHistory = async () => {
    return await db.getAllAsync('SELECT * FROM conversations ORDER BY timestamp ASC');
};

export const clearConversationHistory = async () => {
    await db.runAsync('DELETE FROM conversations');
};
