import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFocusEffect } from '@react-navigation/native';
import { VocabularyItem, Flashcard } from '../types';

export default function HistoryScreen() {
    const [activeTab, setActiveTab] = useState<'vocab' | 'flashcards'>('vocab');
    const { vocabulary, flashcards, isLoading, loadData, deleteVocabulary, deleteFlashcard } = useStore();

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const handleDeleteVocab = (id: number) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteVocabulary(id) },
            ]
        );
    };

    const handleDeleteFlashcard = (id: number) => {
        Alert.alert(
            'Delete Flashcard',
            'Are you sure you want to delete this flashcard?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteFlashcard(id) },
            ]
        );
    };

    const renderVocabItem = ({ item }: { item: VocabularyItem }) => (
        <Card style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.word}>{item.word}</Text>
                    <Text style={styles.translation}>{item.translation}</Text>
                </View>
                <Button
                    title="Delete"
                    variant="danger"
                    onPress={() => handleDeleteVocab(item.id)}
                    style={styles.deleteButton}
                />
            </View>
            {item.example && <Text style={styles.example}>{item.example}</Text>}
        </Card>
    );

    const renderFlashcard = ({ item }: { item: Flashcard }) => (
        <Card style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.word}>{item.front}</Text>
                <Button
                    title="Delete"
                    variant="danger"
                    onPress={() => handleDeleteFlashcard(item.id)}
                    style={styles.deleteButton}
                />
            </View>
            <View style={styles.divider} />
            <Text style={styles.translation}>{item.back}</Text>
            <Text style={styles.status}>{item.status.toUpperCase()}</Text>
        </Card>
    );

    if (isLoading && vocabulary.length === 0 && flashcards.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <LoadingSpinner size="large" />
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

            {activeTab === 'vocab' ? (
                <FlatList
                    data={vocabulary}
                    renderItem={renderVocabItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary }}>
                            No vocabulary found. Start a conversation to generate some!
                        </Text>
                    }
                />
            ) : (
                <FlatList
                    data={flashcards}
                    renderItem={renderFlashcard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.textSecondary }}>
                            No flashcards found. Start a conversation to generate some!
                        </Text>
                    }
                />
            )}
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
        marginBottom: theme.spacing.m,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    deleteButton: {
        height: 32,
        paddingHorizontal: theme.spacing.s,
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
