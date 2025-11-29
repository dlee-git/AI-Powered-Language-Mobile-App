import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = theme.colors.primary,
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.m,
    },
});
