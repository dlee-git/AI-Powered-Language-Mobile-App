export const theme = {
    colors: {
        primary: '#6C63FF', // Vibrant Purple
        secondary: '#03DAC6', // Teal Accent
        background: '#121212', // Dark Background
        surface: '#1E1E1E', // Slightly lighter dark for cards
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        error: '#CF6679',
        success: '#00C853',
        border: '#2C2C2C',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold' as const,
            color: '#FFFFFF',
        },
        h2: {
            fontSize: 24,
            fontWeight: '600' as const,
            color: '#FFFFFF',
        },
        body: {
            fontSize: 16,
            color: '#B0B0B0',
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            color: '#FFFFFF',
        },
    },
    borderRadius: {
        s: 4,
        m: 8,
        l: 16,
        xl: 24,
    },
};

export type Theme = typeof theme;
