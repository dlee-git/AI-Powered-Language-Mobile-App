import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { theme } from '../theme/theme';

interface AvatarProps {
    source?: ImageSourcePropType;
    initials?: string;
    size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ source, initials, size = 40 }) => {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            {source ? (
                <Image source={source} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
            ) : (
                <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials?.slice(0, 2).toUpperCase()}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        resizeMode: 'cover',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
