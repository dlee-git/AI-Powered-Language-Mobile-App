import { useState, useEffect, useCallback } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

interface UseVoiceRecognitionReturn {
    isRecording: boolean;
    results: string[];
    error: string | null;
    startListening: () => Promise<void>;
    stopListening: () => Promise<void>;
    cancelListening: () => Promise<void>;
    destroy: () => Promise<void>;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const onSpeechStart = (e: any) => {
        console.log('onSpeechStart: ', e);
        setIsRecording(true);
        setError(null);
    };

    const onSpeechEnd = (e: any) => {
        console.log('onSpeechEnd: ', e);
        setIsRecording(false);
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
        console.log('onSpeechError: ', e);
        setError(JSON.stringify(e.error));
        setIsRecording(false);
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
        console.log('onSpeechResults: ', e);
        if (e.value) {
            setResults(e.value);
        }
    };

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const startListening = useCallback(async () => {
        try {
            await Voice.start('en-US');
            setIsRecording(true);
            setResults([]);
            setError(null);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const stopListening = useCallback(async () => {
        try {
            await Voice.stop();
            setIsRecording(false);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const cancelListening = useCallback(async () => {
        try {
            await Voice.cancel();
            setIsRecording(false);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const destroy = useCallback(async () => {
        try {
            await Voice.destroy();
            setIsRecording(false);
            setResults([]);
            setError(null);
        } catch (e) {
            console.error(e);
        }
    }, []);

    return {
        isRecording,
        results,
        error,
        startListening,
        stopListening,
        cancelListening,
        destroy,
    };
};
