import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { theme } from '../theme/theme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', loading, style, disabled, ...props }) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.border;
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return theme.colors.secondary;
            case 'danger': return theme.colors.error;
            case 'outline': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textSecondary;
        if (variant === 'outline') return theme.colors.primary;
        return '#FFFFFF'; // Contrast text for filled buttons
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor(), borderColor: variant === 'outline' ? theme.colors.primary : 'transparent', borderWidth: variant === 'outline' ? 1 : 0 },
                style
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: theme.borderRadius.m,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
    },
    text: {
        ...theme.typography.button,
    },
});
