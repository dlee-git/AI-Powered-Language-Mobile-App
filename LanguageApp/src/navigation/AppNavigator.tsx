import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RoleplayScreen from '../screens/RoleplayScreen';
import TutorScreen from '../screens/TutorScreen';
import { theme } from '../theme/theme';

// Tab Params
export type RootTabParamList = {
    Home: undefined;
    History: undefined;
    Settings: undefined;
};

// Stack Params
export type RootStackParamList = {
    MainTabs: undefined;
    Roleplay: undefined;
    Tutor: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.surface },
                headerTintColor: theme.colors.text,
                tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
                name="Roleplay"
                component={RoleplayScreen}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="Tutor"
                component={TutorScreen}
                options={{ presentation: 'fullScreenModal' }}
            />
        </Stack.Navigator>
    );
}
