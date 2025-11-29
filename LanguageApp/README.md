# AI-Powered Language Learning App

A cross-platform mobile application for language learning, featuring real-time voice conversations with AI tutors, adaptive difficulty, and personalized review artifacts (vocabulary & flashcards).

## Features

- **Voice Conversations**: Practice speaking with an AI tutor or roleplay in various scenarios (e.g., Café).
- **Adaptive Learning**: Adjusts difficulty (A1-C1) and language (L1/L2) based on your preferences.
- **Review Artifacts**: Automatically generates vocabulary lists and flashcards from your conversations.
- **Offline-First**: Stores history and artifacts locally using SQLite.
- **Cost-Optimized**: Uses on-device ASR (Speech-to-Text) by default, falling back to cloud only when necessary.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Database**: Expo SQLite
- **AI Integration**: OpenAI API (GPT-4o-mini, Whisper)
- **Audio**: expo-av, expo-speech, @react-native-voice/voice

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure API Key**:
    - Open `src/services/api.ts`.
    - Replace `YOUR_API_KEY_HERE` with your valid OpenAI API Key.

3.  **Run the App**:
    - **Android**: `npm run android`
    - **iOS**: `npm run ios`
    - **Web**: `npm run web`

## Testing

Run unit and integration tests with Jest:

```bash
npm test
```

*Note: If you encounter environment issues with tests, ensure you have the correct Node.js version and dependencies installed.*

## Architecture

- **`src/screens`**: UI screens (Home, Roleplay, Tutor, History, Settings).
- **`src/components`**: Reusable UI components (Button, Card, Input, Avatar).
- **`src/services`**: Business logic and external integrations (API, Database, Audio).
- **`src/store`**: Global state management (Zustand).
- **`src/types`**: TypeScript definitions.

## License

MIT
