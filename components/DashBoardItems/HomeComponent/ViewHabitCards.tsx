import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import React from 'react';

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
// Always expects value in seconds
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

    return (
        <View style={styles.container}>
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
                                        {
                                            backgroundColor: cardBgColor,
                                            marginTop: index === 0 ? 0 : -143,
                                            zIndex: index,
                                            borderColor: "#00000022",
                                            borderWidth: 1.5,
                                            paddingVertical: 20,
                                            paddingHorizontal: 18,
                                        }
                                    ]}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={styles.cardTitle}>{item.title}</Text>
                                        <Pressable
                                            onPress={() => handleDeleteCard(originalIndex)}
                                            style={{
                                                backgroundColor: "rgba(255, 76, 76, 1)",
                                                height: 30, width: 30,
                                                justifyContent: "center", alignItems: "center",
                                                borderRadius: 15
                                            }}>
                                            <FontAwesome name="trash" size={20} color="#fff" />
                                        </Pressable>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: '#00000022', marginVertical: 4 }} />
                                    <Text style={styles.cardSubtitle}>{item.description || "No description provided."}</Text>
                                    <Text style={{ fontSize: 14, color: "#222", marginTop: 4 }}>
                                        Duration: {formatDuration(item.duration)}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: "#222", marginTop: 4 }}>
                                        Habit Type: {item.habitType}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: "#222", marginTop: 4 }}>
                                        Frequency: {item.frequency}
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                                        <Text style={{ fontSize: 12, color: '#555' }}>Tap to view</Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                </View>
            </ScrollView>

            {selectedCard && (
                <View style={styles.modalWrapper}>
                    <Pressable style={styles.modalOverlay} onPress={() => setSelectedCard(null)} />
                    <View style={[styles.modalContent, { backgroundColor: selectedCard.backgroundColor }]}>
                        <Text style={styles.modalTitle}>{selectedCard.title}</Text>
                        <Text style={styles.modalDescription}>
                            {selectedCard.description}
                            {"\n\n"}Duration: {formatDuration(selectedCard.duration)}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
                            <Text style={styles.modalClose} onPress={() => setSelectedCard(null)}>Close</Text>
                            <Text
                                style={styles.startTimerButton}
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
                            >Start</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    cardTitle: { fontSize: 20, fontWeight: "600", color: "#222", marginBottom: 6 },
    cardSubtitle: { fontSize: 16, color: "#444", lineHeight: 22 },
    Card: {
        borderRadius: 20, elevation: 8, height: 220, backgroundColor: "#fff",
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2, shadowRadius: 10,
    },
    modalWrapper: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 120,
        justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modalOverlay: {
        position: 'absolute',
        top: -500, left: -500, right: -500, bottom: -500,
        backgroundColor: "rgb(0,0,0,0.4)"
    },
    modalContent: {
        width: '90%', maxWidth: 350, borderRadius: 20, padding: 20,
        backgroundColor: '#fff', elevation: 10,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    modalDescription: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
    modalClose: {
        fontSize: 16, backgroundColor: '#fc5a5a', color: '#fff', fontWeight: 'bold',
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, textAlign: 'center',
        borderWidth: 1, borderColor: "#000",
    },
    startTimerButton: {
        fontSize: 16, backgroundColor: '#58d03d', color: '#fff', fontWeight: 'bold',
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, textAlign: 'center',
        borderWidth: 1, borderColor: "#000",
    },
});

export default ViewCardModal;
