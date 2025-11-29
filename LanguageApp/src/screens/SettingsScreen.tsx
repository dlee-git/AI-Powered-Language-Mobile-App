import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { useStore } from '../store/useStore';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function SettingsScreen() {
    const { userLanguage, targetLanguage, difficultyLevel, setLanguage, setDifficulty } = useStore();

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
                        onPress={() => setDifficulty(level as any)}
                    >
                        <Text style={[styles.optionText, difficultyLevel === level && styles.activeOptionText]}>
                            {level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
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
});
