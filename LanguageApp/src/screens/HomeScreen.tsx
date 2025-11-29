import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { theme } from '../theme/theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList, RootStackParamList } from '../navigation/AppNavigator';

type Props = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, 'Home'>,
    NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
    const { targetLanguage, difficultyLevel } = useStore();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome Back!</Text>
                <Text style={styles.subtext}>
                    Ready to practice {targetLanguage.toUpperCase()}?
                </Text>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>Current Level</Text>
                <Text style={styles.levelText}>{difficultyLevel}</Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => navigation.navigate('Roleplay')}
                >
                    <Text style={styles.buttonText}>Start Roleplay</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => navigation.navigate('Tutor')}
                >
                    <Text style={styles.buttonText}>Start Tutor Mode</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.l,
        alignItems: 'center',
    },
    header: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    greeting: {
        ...theme.typography.h1,
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    subtext: {
        ...theme.typography.body,
        textAlign: 'center',
    },
    statsCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.l,
        borderRadius: theme.borderRadius.l,
        width: '100%',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.s,
    },
    levelText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    actionsContainer: {
        width: '100%',
        gap: theme.spacing.m,
    },
    button: {
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    buttonText: {
        ...theme.typography.button,
    },
});
