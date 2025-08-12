import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { toggletheme } from '../redux/action'; // adjust import path
import type { RootState } from '../redux/rootReducer'; // adjust import path

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string; // seconds as string
    frequency: string;
    completed: boolean;
};

type Props = {
    navigation: any;
    route: any;
};

const TimerScreen = ({ navigation, route }: Props) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem("colorMode");
            if (savedTheme !== null) {
                const parsedTheme = JSON.parse(savedTheme);
                if (parsedTheme !== darkMode) {
                    dispatch(toggletheme(parsedTheme));
                }
            }
        })();
    }, []);

    const { Title, Description, Duration, HabitTypes, cardIndex } = route.params;

    const [customCards, setCustomCards] = useState<CardDetail[]>([]);

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

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("customCards");
            if (stored) setCustomCards(JSON.parse(stored));
        })();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && secondsLeft > 0) {
            timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, secondsLeft]);

    useEffect(() => {
        if (secondsLeft === 0 && customCards.length > 0) {
            (async () => {
                const updatedCards = [...customCards];
                if (updatedCards[cardIndex]) {
                    updatedCards[cardIndex] = {
                        ...updatedCards[cardIndex],
                        completed: true,
                    };
                    setCustomCards(updatedCards);
                    await AsyncStorage.setItem("customCards", JSON.stringify(updatedCards));
                }
                setIsRunning(false);
            })();
        }
    }, [secondsLeft]);

    const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, '0');
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <View style={[styles.container, darkMode && styles.containerDark]}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.backButton, darkMode && styles.backButtonDark]}
            >
                <FontAwesome name="arrow-left" size={24} color={darkMode ? "#fff" : "#000"} />
            </TouchableOpacity>

            <Text style={[styles.HabitTitle, darkMode && styles.HabitTitleDark]}>{Title}</Text>
            <Text style={[styles.HabitDescription, darkMode && styles.HabitDescriptionDark]}>{Description}</Text>

            <Text style={[styles.originalTime, darkMode && styles.originalTimeDark]}>
                Original Duration: {formatTime(startingSeconds)}
            </Text>

            <View style={[styles.gifContainer, darkMode && styles.gifContainerDark]}>
                <Image source={selectedGif} style={styles.gif} />
            </View>

            <Text style={[styles.TimerText, darkMode && styles.TimerTextDark]}>{formatTime(secondsLeft)}</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={() => setIsRunning(!isRunning)}
                    style={[
                        styles.button,
                        { backgroundColor: isRunning ? '#f1a6a6ff' : '#b8e994' },
                        darkMode && styles.buttonDark,
                    ]}
                >
                    <Text style={[styles.buttonText, darkMode && styles.buttonTextDark]}>
                        {isRunning ? "Pause" : "Start"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setIsRunning(false);
                        setSecondsLeft(startingSeconds);
                    }}
                    style={[styles.button, { backgroundColor: '#f8c291' }, darkMode && styles.buttonDark]}
                >
                    <Text style={[styles.buttonText, darkMode && styles.buttonTextDark]}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        justifyContent: "center",
        backgroundColor: '#82ccdd',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#f1a6a6ff',
    },
    backButtonDark: {
        backgroundColor: '#ff7979',
    },
    HabitTitle: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
        color: '#fff',
    },
    HabitTitleDark: {
        color: '#eee',
    },
    HabitDescription: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    HabitDescriptionDark: {
        color: '#ccc',
    },
    originalTime: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    originalTimeDark: {
        color: '#bbb',
    },
    gifContainer: {
        height: 200,
        width: 200,
        backgroundColor: "#0a0a0a20",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
        borderRadius: 12,
    },
    gifContainerDark: {
        backgroundColor: "#222",
    },
    gif: {
        width: 200,
        height: 200,
        borderRadius: 12,
    },
    TimerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    TimerTextDark: {
        color: '#eee',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDark: {
        shadowOpacity: 0.6,
        shadowColor: '#fff',
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    buttonTextDark: {
        color: '#fff',
    },
});

export default TimerScreen;
