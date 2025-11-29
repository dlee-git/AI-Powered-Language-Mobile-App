import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
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

            <Card style={styles.statsCard}>
                <Text style={styles.cardTitle}>Current Level</Text>
                <Text style={styles.levelText}>{difficultyLevel}</Text>
            </Card>

            <View style={styles.actionsContainer}>
                <Button
                    title="Start Roleplay"
                    onPress={() => navigation.navigate('Roleplay')}
                    style={styles.buttonSpacing}
                />

                <Button
                    title="Start Tutor Mode"
                    variant="outline"
                    onPress={() => navigation.navigate('Tutor')}
                />
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
        width: '100%',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
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
    },
    buttonSpacing: {
        marginBottom: theme.spacing.m,
    },
});
