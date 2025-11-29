import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { speak } from '../services/audio';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { sendMessage, clearHistory, setSystemPrompt } from '../services/api';
import { addMessage } from '../services/database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Tutor'>;

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function TutorScreen({ navigation }: Props) {
    const { isRecording, results, startListening, stopListening, error } = useVoiceRecognition();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const wasRecording = useRef(false);

    useEffect(() => {
        clearHistory();
        setSystemPrompt("You are a helpful language tutor. Correct the user's grammar and explain mistakes. Be encouraging and concise.");
        setMessages([{ role: 'assistant', content: 'Hello! I am your AI Tutor. What would you like to practice today?' }]);
    }, []);

    useEffect(() => {
        if (wasRecording.current && !isRecording && results.length > 0) {
            const text = results[0];
            handleSendMessage(text);
        }
        wasRecording.current = isRecording;
    }, [isRecording, results]);

    const handleToggleRecording = async () => {
        if (isRecording) {
            await stopListening();
        } else {
            await startListening();
        }
    };

    const handleSendMessage = async (text: string) => {
        const userMsg: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        await addMessage('user', text);

        try {
            const response = await sendMessage(text);
            const assistantMsg: ChatMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, assistantMsg]);
            await addMessage('assistant', response);
            speak(response);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tutor Mode</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.chatContainer}>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.content}</Text>
                    </View>
                ))}
                {isLoading && <ActivityIndicator color={theme.colors.primary} />}
                {error && <Text style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</Text>}
            </ScrollView>

            <View style={styles.controls}>
                {isRecording && <Text style={{ marginBottom: 10, color: theme.colors.primary }}>Listening...</Text>}
                <TouchableOpacity
                    style={[styles.recordButton, isRecording && styles.recordingActive]}
                    onPress={handleToggleRecording}
                >
                    <Text style={styles.recordButtonText}>
                        {isRecording ? 'Stop Recording' : 'Hold to Speak'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginTop: 40,
    },
    title: {
        ...theme.typography.h2,
        fontSize: 18,
    },
    closeButton: {
        color: theme.colors.error,
        fontSize: 16,
        fontWeight: '600',
    },
    chatContainer: {
        padding: theme.spacing.m,
        flexGrow: 1,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
    },
    assistantBubble: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.surface,
    },
    messageText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    controls: {
        padding: theme.spacing.l,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
    },
    recordButton: {
        width: 200,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordingActive: {
        backgroundColor: theme.colors.error,
    },
    recordButtonText: {
        ...theme.typography.button,
        fontSize: 18,
    },
});
