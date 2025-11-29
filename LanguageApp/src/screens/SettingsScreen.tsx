import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { LanguageCode, DifficultyLevel } from '../types';

const LANGUAGES: { code: LanguageCode; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
];

const LEVELS: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function SettingsScreen() {
    const { userLanguage, targetLanguage, difficultyLevel, setLanguage, setDifficulty, clearHistory } = useStore();

    const handleClearData = () => {
        Alert.alert(
            "Clear Data",
            "Are you sure you want to clear all conversation history?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        await clearHistory();
                        Alert.alert("Success", "History cleared.");
                    }
                }
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>My Language (L1)</Text>
            <View style={styles.optionsContainer}>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[styles.option, userLanguage === lang.code && styles.activeOption]}
                        onPress={() => setLanguage('user', lang.code)}
                    >
                        <Text style={[styles.optionText, userLanguage === lang.code && styles.activeOptionText]}>
                            {lang.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Target Language (L2)</Text>
            <View style={styles.optionsContainer}>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[styles.option, targetLanguage === lang.code && styles.activeOption]}
                        onPress={() => setLanguage('target', lang.code)}
                    >
                        <Text style={[styles.optionText, targetLanguage === lang.code && styles.activeOptionText]}>
                            {lang.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Difficulty Level</Text>
            <View style={styles.optionsContainer}>
                {LEVELS.map((level) => (
                    <TouchableOpacity
                        key={level}
                        style={[styles.option, difficultyLevel === level && styles.activeOption]}
                        onPress={() => setDifficulty(level)}
                    >
                        <Text style={[styles.optionText, difficultyLevel === level && styles.activeOptionText]}>
                            {level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.divider} />

            <Button
                title="Clear Conversation History"
                onPress={handleClearData}
                variant="danger"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
    },
    sectionTitle: {
        ...theme.typography.h2,
        fontSize: 20,
        marginBottom: theme.spacing.m,
        marginTop: theme.spacing.m,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.s,
        marginBottom: theme.spacing.l,
    },
    option: {
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    activeOption: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    optionText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    activeOptionText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.xl,
    },
});
