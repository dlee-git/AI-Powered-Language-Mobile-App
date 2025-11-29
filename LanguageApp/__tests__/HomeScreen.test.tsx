import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation
const mockNavigation = {
    navigate: jest.fn(),
};

// Mock useStore
jest.mock('../src/store/useStore', () => ({
    useStore: () => ({
        userLanguage: 'en',
        targetLanguage: 'es',
        difficultyLevel: 'A1',
    }),
}));

describe('HomeScreen', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen navigation={mockNavigation as any} route={{} as any} />
            </NavigationContainer>
        );

        expect(getByText('AI Language Tutor')).toBeTruthy();
        expect(getByText('Roleplay Mode')).toBeTruthy();
        expect(getByText('Tutor Mode')).toBeTruthy();
    });

    it('navigates to Roleplay mode', () => {
        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen navigation={mockNavigation as any} route={{} as any} />
            </NavigationContainer>
        );

        fireEvent.press(getByText('Start Roleplay'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Roleplay');
    });

    it('navigates to Tutor mode', () => {
        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen navigation={mockNavigation as any} route={{} as any} />
            </NavigationContainer>
        );

        fireEvent.press(getByText('Start Tutor Session'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Tutor');
    });
});
