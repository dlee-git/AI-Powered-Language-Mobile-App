import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { speak, startRecording as startFallbackRecording, stopRecording as stopFallbackRecording } from '../services/audio';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { sendMessage, clearHistory, setSystemPrompt, transcribeAudio } from '../services/api';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ChatMessage } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Roleplay'>;

export default function RoleplayScreen({ navigation }: Props) {
    const { isRecording, results, startListening, stopListening, error } = useVoiceRecognition();
    const { addChatMessage } = useStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFallbackRecording, setIsFallbackRecording] = useState(false);
    const wasRecording = useRef(false);

    useEffect(() => {
        // Clear history on mount for a fresh session
        clearHistory();
        setSystemPrompt("You are a barista in a café. Engage in a conversation with the customer. Keep your responses concise and natural.");
        setMessages([]);
    }, []);

    useEffect(() => {
        if (wasRecording.current && !isRecording && results.length > 0) {
            const text = results[0];
            handleSendMessage(text);
        }
        wasRecording.current = isRecording;
    }, [isRecording, results]);

    const handleToggleRecording = async () => {
        if (isFallbackRecording) {
            setIsFallbackRecording(false);
            const uri = await stopFallbackRecording();
            if (uri) {
                setIsLoading(true);
                const text = await transcribeAudio(uri);
                setIsLoading(false);
                if (text) {
                    handleSendMessage(text);
                } else {
                    alert("Failed to transcribe audio.");
                }
            }
            return;
        }

        if (error) {
            const started = await startFallbackRecording();
            if (started) setIsFallbackRecording(true);
        } else {
            if (isRecording) {
                await stopListening();
            } else {
                await startListening();
            }
        }
    };

    const handleSendMessage = async (text: string) => {
        const userMsg: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        await addChatMessage('user', text);

        try {
            const response = await sendMessage(text);
            const assistantMsg: ChatMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, assistantMsg]);
            await addChatMessage('assistant', response);

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
                <Text style={styles.title}>Roleplay: Café Scenario</Text>
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
                {error && <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 10 }}>Native ASR Error: {error}. Using Cloud ASR.</Text>}
            </ScrollView>

            <View style={styles.controls}>
                {(isRecording || isFallbackRecording) && <Text style={{ marginBottom: 10, color: theme.colors.primary }}>Listening...</Text>}
                <Button
                    title={isRecording || isFallbackRecording ? 'Stop Recording' : (error ? 'Hold to Speak (Cloud)' : 'Hold to Speak')}
                    onPress={handleToggleRecording}
                    variant={isRecording || isFallbackRecording ? 'danger' : 'primary'}
                    style={{ width: 200 }}
                />
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
});
