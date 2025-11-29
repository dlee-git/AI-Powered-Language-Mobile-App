import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { getVocabulary, getFlashcards } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
    const [activeTab, setActiveTab] = useState<'vocab' | 'flashcards'>('vocab');
    const [vocabList, setVocabList] = useState<any[]>([]);
    const [flashcardList, setFlashcardList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const vocab = await getVocabulary();
            const cards = await getFlashcards();
            setVocabList(vocab);
            setFlashcardList(cards);
        } catch (error) {
            console.error('Failed to load history data', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const renderVocabItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.translation}>{item.translation}</Text>
            <Text style={styles.example}>{item.example}</Text>
        </View>
    );

    const renderFlashcard = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.word}>{item.front}</Text>
            <View style={styles.divider} />
            <Text style={styles.translation}>{item.back}</Text>
            <Text style={styles.status}>{item.status.toUpperCase()}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'vocab' && styles.activeTab]}
                    onPress={() => setActiveTab('vocab')}
                >
                    <Text style={[styles.tabText, activeTab === 'vocab' && styles.activeTabText]}>Vocabulary</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'flashcards' && styles.activeTab]}
                    onPress={() => setActiveTab('flashcards')}
                >
                    <Text style={[styles.tabText, activeTab === 'flashcards' && styles.activeTabText]}>Flashcards</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={activeTab === 'vocab' ? vocabList : flashcardList}
                renderItem={activeTab === 'vocab' ? renderVocabItem : renderFlashcard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary }}>
                        No items found. Start a conversation to generate some!
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    tabs: {
        flexDirection: 'row',
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surface,
    },
    tab: {
        flex: 1,
        paddingVertical: theme.spacing.s,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: theme.colors.primary,
    },
    listContent: {
        padding: theme.spacing.m,
    },
    card: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
    },
    word: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    translation: {
        fontSize: 16,
        color: theme.colors.primary,
        marginBottom: theme.spacing.s,
    },
    example: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.s,
    },
    status: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        alignSelf: 'flex-end',
        marginTop: theme.spacing.xs,
    },
});
