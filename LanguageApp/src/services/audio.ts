import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

let recording: Audio.Recording | undefined;

export const startRecording = async () => {
    try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status === 'granted') {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recording = newRecording;
            console.log('Recording started');
            return true;
        } else {
            console.log('Permission to access microphone denied');
            return false;
        }
    } catch (err) {
        console.error('Failed to start recording', err);
        return false;
    }
};

export const stopRecording = async () => {
    if (!recording) {
        return null;
    }
    try {
        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        recording = undefined;
        return uri;
    } catch (error) {
        console.error('Failed to stop recording', error);
        return null;
    }
};

export const speak = (text: string, language: string = 'en') => {
    Speech.speak(text, {
        language,
        pitch: 1.0,
        rate: 0.9,
    });
};

export const stopSpeaking = () => {
    Speech.stop();
};
