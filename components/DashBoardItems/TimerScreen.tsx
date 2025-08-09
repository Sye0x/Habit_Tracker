import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import AsyncStorage from '@react-native-async-storage/async-storage';

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string; // stored as total seconds in string form
    frequency: string;
    completed: boolean;
};

type Props = {
    navigation: any;
    route: any;
};

// Format any total seconds value into HH:MM:SS
const formatHMS = (value: string | number) => {
    let totalSeconds = typeof value === "string" ? parseInt(value, 10) : value;
    if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;

    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const TimerScreen = ({ navigation, route }: Props) => {
    const { Title, Description, Duration, HabitTypes, cardIndex } = route.params;

    const [customCards, setCustomCards] = useState<CardDetail[]>([]);

    // Always treat Duration as total seconds
    const startingSeconds = Math.max(0, parseInt(Duration, 10) || 0);
    const [secondsLeft, setSecondsLeft] = useState(startingSeconds);
    const [isRunning, setIsRunning] = useState(false);

    const habitGifMap: Record<string, any> = {
        Cardio: require('../../assets/images/Cardio.gif'),
        Strength: require('../../assets/images/Strength.gif'),
        Meditation: require('../../assets/images/Meditation.gif'),
        Study: require('../../assets/images/Study.gif'),
    };
    const selectedGif = habitGifMap[HabitTypes] || require('../../assets/images/Cardio.gif');

    // Load custom cards from storage
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("customCards");
            if (stored) setCustomCards(JSON.parse(stored));
        })();
    }, []);

    // Countdown effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && secondsLeft > 0) {
            timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, secondsLeft]);

    // When timer hits zero, mark card as completed
    useEffect(() => {
        if (secondsLeft === 0 && customCards.length > 0) {
            (async () => {
                const updatedCards = [...customCards];
                if (updatedCards[cardIndex]) {
                    updatedCards[cardIndex] = {
                        ...updatedCards[cardIndex],
                        completed: true
                    };
                    setCustomCards(updatedCards);
                    await AsyncStorage.setItem("customCards", JSON.stringify(updatedCards));
                }
                setIsRunning(false);
            })();
        }
    }, [secondsLeft]);

    // Simple time formatting for current timer
    const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, '0');
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.HabitTitle}>{Title}</Text>
            <Text style={styles.HabitDescription}>{Description}</Text>

            {/* Original stored duration */}
            <Text style={styles.originalTime}>
                Original Duration: {formatHMS(Duration)}
            </Text>

            <View style={styles.gifContainer}>

            </View>

            <Text style={styles.TimerText}>{formatTime(secondsLeft)}</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={() => setIsRunning(!isRunning)}
                    style={[styles.button, { backgroundColor: isRunning ? '#f1a6a6ff' : '#b8e994' }]}>
                    <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { setIsRunning(false); setSecondsLeft(startingSeconds); }}
                    style={[styles.button, { backgroundColor: '#f8c291' }]}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", padding: 20, justifyContent: "center", backgroundColor: '#82ccdd' },
    backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, padding: 10, borderRadius: 50, backgroundColor: '#f1a6a6ff' },
    HabitTitle: { fontSize: 32, fontWeight: "bold", marginBottom: 10, textAlign: 'center', color: '#fff' },
    HabitDescription: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 10, paddingHorizontal: 10 },
    originalTime: { fontSize: 14, color: '#fff', marginBottom: 20, fontStyle: 'italic' },
    gifContainer: { height: 200, width: 200, backgroundColor: "#0a0a0a20", justifyContent: "center", alignItems: "center" },
    gif: { width: 200, height: 200 },
    TimerText: { fontSize: 64, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
    buttonsContainer: { flexDirection: 'row', gap: 20 },
    button: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
    buttonText: { fontSize: 16, color: '#000', fontWeight: 'bold' }
});

export default TimerScreen;
