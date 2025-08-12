import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './../../redux/rootReducer';  // Adjust path

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string; // stored in seconds
    frequency: string;
    completed: boolean;
};

type CardDetailWithColor = CardDetail & { backgroundColor: string };

type Props = {
    customCards: CardDetail[];
    setCustomCards: React.Dispatch<React.SetStateAction<CardDetail[]>>;
    navigation: any;
};

// ---- Duration Formatter ----
const formatDuration = (value: string) => {
    const totalSeconds = parseInt(value, 10) || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
    ].join(":");
};

function ViewCardModal({ customCards, setCustomCards, navigation }: Props) {
    const [selectedCard, setSelectedCard] = useState<CardDetailWithColor | null>(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

    // Get dark mode boolean from Redux
    const isDarkMode = useSelector((state: RootState) => state.theme);

    const loadCustomCards = async () => {
        const stored = await AsyncStorage.getItem("customCards");
        if (stored) {
            setCustomCards(JSON.parse(stored));
        }
    };

    const handleDeleteCard = async (indexToDelete: number) => {
        const updatedCards = [...customCards];
        updatedCards.splice(indexToDelete, 1);
        setCustomCards(updatedCards);
        await AsyncStorage.setItem("customCards", JSON.stringify(updatedCards));
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCustomCards();
        }, [])
    );

    useEffect(() => {
        loadCustomCards();
    }, []);

    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, themeStyles.container]}>
            <ScrollView style={{ flex: 1, marginBottom: 50, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
                    {customCards
                        .map((item, originalIndex) => ({ item, originalIndex }))
                        .filter(({ item }) => !item.completed)
                        .reverse()
                        .map(({ item, originalIndex }, index) => {
                            const bgColors = ["#82ccdd", "#f1a6a6ff", "#b8e994", "#f8c291"];
                            const cardBgColor = bgColors[index % bgColors.length];

                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setSelectedCard({ ...item, backgroundColor: cardBgColor });
                                        setSelectedCardIndex(originalIndex);
                                    }}
                                    style={[
                                        styles.Card,
                                        isDarkMode
                                            ? darkStyles.Card
                                            : { backgroundColor: cardBgColor },
                                        { marginTop: index === 0 ? 0 : -143, zIndex: index }
                                    ]}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
                                            <Text style={[styles.cardTitle, themeStyles.cardTitle]}>{item.title}</Text>
                                            <Text style={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" }}>({item.frequency})</Text>
                                        </View>

                                        <Pressable
                                            onPress={() => handleDeleteCard(originalIndex)}
                                            style={{
                                                backgroundColor: "rgba(255, 76, 76, 1)",
                                                height: 28, width: 28,
                                                justifyContent: "center", alignItems: "center",
                                                borderRadius: 15,

                                            }}>
                                            <FontAwesome name="trash" size={20} color="#fff" />
                                        </Pressable>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: isDarkMode ? '#ffffff33' : '#00000022', marginVertical: 4 }} />
                                    <Text style={[styles.cardSubtitle, themeStyles.cardSubtitle]}>
                                        {item.description || "No description provided."}
                                    </Text>
                                    <Text style={[{ fontSize: 14, marginTop: 4 }, themeStyles.cardSubtitle]}>
                                        Duration: {formatDuration(item.duration)}
                                    </Text>
                                    <Text style={[{ fontSize: 14, marginTop: 4 }, themeStyles.cardSubtitle]}>
                                        Habit Type: {item.habitType}
                                    </Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                                        <Text style={{ fontSize: 12, color: isDarkMode ? '#999' : '#555' }}>Tap to view</Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                </View>
            </ScrollView>

            {selectedCard && (
                <View style={styles.modalWrapper}>
                    <Pressable style={styles.modalOverlay} onPress={() => setSelectedCard(null)} />
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: isDarkMode ? '#222' : selectedCard.backgroundColor },
                            isDarkMode && darkStyles.modalContent
                        ]}
                    >
                        <Text style={[styles.modalTitle, themeStyles.modalTitle]}>{selectedCard.title}</Text>
                        <Text style={[styles.modalDescription, themeStyles.modalDescription]}>
                            {selectedCard.description}
                            {"\n\n"}Duration: {formatDuration(selectedCard.duration)}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
                            <Pressable
                                onPress={() => setSelectedCard(null)}
                                style={[styles.modalButton, isDarkMode ? darkStyles.modalButtonClose : styles.modalClose]}
                            >
                                <Text style={isDarkMode ? darkStyles.modalButtonText : styles.modalCloseText}>Close</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setSelectedCard(null);
                                    navigation.navigate("TimerScreen", {
                                        Title: selectedCard.title,
                                        Description: selectedCard.description,
                                        Duration: selectedCard.duration,
                                        HabitTypes: selectedCard.habitType,
                                        cardIndex: selectedCardIndex,
                                    });
                                }}
                                style={[styles.modalButton, isDarkMode ? darkStyles.modalButtonStart : styles.startTimerButton]}
                            >
                                <Text style={isDarkMode ? darkStyles.modalButtonText : styles.startTimerButtonText}>Start</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    cardTitle: { fontSize: 20, fontWeight: "600", marginBottom: 6 },
    cardSubtitle: { fontSize: 16, lineHeight: 22 },
    Card: {
        borderRadius: 20,
        elevation: 8,
        height: 200,
        paddingVertical: 20,
        paddingHorizontal: 18,
    },
    modalWrapper: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 120,
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modalOverlay: {
        position: 'absolute',
        top: -500, left: -500, right: -500, bottom: -500,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    modalContent: {
        width: '90%', maxWidth: 350, borderRadius: 20, padding: 20, elevation: 10,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    modalDescription: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    modalClose: {
        fontSize: 16, backgroundColor: '#fc5a5a', color: '#fff', fontWeight: 'bold',
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, textAlign: 'center',

    },
    modalCloseText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    startTimerButton: {
        fontSize: 16, backgroundColor: '#58d03d', color: '#fff', fontWeight: 'bold',
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, textAlign: 'center',

    },
    startTimerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    modalButton: {
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        minWidth: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    }
});

const lightStyles = StyleSheet.create({
    container: { backgroundColor: "#f0f4f8" },
    cardTitle: { color: "#222" },
    cardSubtitle: { color: "#444" },
    modalTitle: { color: "#000" },
    modalDescription: { color: "#555" },
});

const darkStyles = StyleSheet.create({
    container: { backgroundColor: "#121212" },

    cardTitle: { color: "#e0e0e0" }, // softer white
    cardSubtitle: { color: "#bbbbbb" }, // lighter gray for subtitles

    Card: {
        backgroundColor: "#292929",   // deeper dark gray base
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#444",          // softer border
        elevation: 6,
        shadowColor: "#000000AA",     // stronger shadow
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 18,
    },

    modalTitle: { color: "#f0f0f0" },
    modalDescription: { color: "#ccc" },

    modalContent: {
        backgroundColor: "#1a1a1a", // very dark background for modal
        width: '90%', maxWidth: 350,
        borderRadius: 20,
        padding: 20,
        elevation: 20,
        shadowColor: "#00ffccaa", // subtle teal glow
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.7,
        shadowRadius: 16,
    },

    modalButtonClose: {
        backgroundColor: "#e74c3c", // vibrant red
        borderWidth: 0,
        shadowColor: "#e74c3c",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },

    modalButtonStart: {
        backgroundColor: "#27ae60", // rich green
        borderWidth: 0,
        shadowColor: "#27ae60",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },

    modalButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        textAlign: "center",
        textShadowColor: "#0009",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});

export default ViewCardModal;
