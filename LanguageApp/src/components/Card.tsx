import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme/theme';

interface CardProps extends ViewProps {
    variant?: 'default' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default', ...props }) => {
    return (
        <View
            style={[
                styles.card,
                variant === 'outlined' && styles.outlined,
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
        elevation: 0,
    },
});
