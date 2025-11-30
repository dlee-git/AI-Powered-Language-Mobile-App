import OpenAI from 'openai';
import { getCachedResponse, setCachedResponse } from './cache';

// TODO: Replace with your actual OpenAI API key or use a secure way to fetch it (e.g., backend proxy or environment variable)
const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Required for React Native if not using a backend proxy
});

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const MAX_CONTEXT_TURNS = 10;
let conversationHistory: Message[] = [];

export const addToHistory = (role: 'user' | 'assistant' | 'system', content: string) => {
    conversationHistory.push({ role, content });
    pruneContext();
};

const pruneContext = () => {
    // Always keep the system prompt if it exists (usually index 0)
    const systemPrompt = conversationHistory.find(m => m.role === 'system');

    // Filter out system prompt for counting turns
    const turns = conversationHistory.filter(m => m.role !== 'system');

    if (turns.length > MAX_CONTEXT_TURNS) {
        const prunedTurns = turns.slice(-MAX_CONTEXT_TURNS);
        conversationHistory = systemPrompt ? [systemPrompt, ...prunedTurns] : prunedTurns;
    }
};

export const getContext = () => {
    return conversationHistory;
};

export const clearHistory = () => {
    conversationHistory = [];
};

export const setSystemPrompt = (prompt: string) => {
    // Remove existing system prompt if any
    conversationHistory = conversationHistory.filter(m => m.role !== 'system');
    // Add new system prompt at the beginning
    conversationHistory.unshift({ role: 'system', content: prompt });
};

export const transcribeAudio = async (uri: string) => {
    try {
        if (OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('OpenAI API Key not set.');
        }

        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'audio/m4a',
            name: 'audio.m4a',
        } as any);
        formData.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Whisper Fetch Error:', error);
        return null;
    }
};

export const sendMessage = async (message: string): Promise<string> => {
    console.log('Sending message to LLM:', message);
    addToHistory('user', message);

    // Check cache
    const cacheKey = `response_${message}_${conversationHistory.length}`; // Simple cache key
    const cached = getCachedResponse<string>(cacheKey);
    if (cached) {
        console.log('Returning cached response');
        addToHistory('assistant', cached as string);
        return cached as string;
    }

    try {
        if (OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('OpenAI API Key not set. Please update src/services/api.ts');
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversationHistory,
        });

        const responseContent = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

        setCachedResponse(cacheKey, responseContent);
        addToHistory('assistant', responseContent);
        return responseContent;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback for demo purposes if key is missing or error occurs
        return "I'm having trouble connecting to the AI service. Please check your API key and internet connection.";
    }
};
