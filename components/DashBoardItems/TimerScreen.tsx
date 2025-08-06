import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
const TimerScreen = ({ navigation, route }: any) => {
    const { Title, Description, Duration } = route.params;
    const totalSeconds = Math.round(parseFloat(Duration) * 60);

    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isRunning && secondsLeft > 0) {
            timer = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        }

        if (secondsLeft === 0) {
            setIsRunning(false);
        }

        return () => clearInterval(timer);
    }, [isRunning, secondsLeft]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSecondsLeft(totalSeconds);
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.HabitTitle}>{Title}</Text>
            <Text style={styles.HabitDescription}>{Description}</Text>




            <Text style={styles.TimerText}>{formatTime(secondsLeft)}</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleStartStop} style={[styles.button, { backgroundColor: isRunning ? '#f1a6a6ff' : '#b8e994' }]}>
                    <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleReset} style={[styles.button, { backgroundColor: '#f8c291' }]}>
                    <Text style={styles.buttonText}>Reset</Text>
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#f1a6a6ff',
    },
    HabitTitle: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
        color: '#fff',
    },
    HabitDescription: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    TimerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
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
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold'
    }
});

export default TimerScreen;
