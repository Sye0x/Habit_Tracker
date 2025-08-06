import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";

// ---------------------------
// Type Definitions
// ---------------------------
type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string;
};

type CardDetailWithColor = CardDetail & { backgroundColor: string };

type Day = { date: number; status: string; day: number };

// ---------------------------
// Main Component
// ---------------------------
function HomeScreen({ navigation }: any) {
    // ---------------------------
    // State Variables
    // ---------------------------
    const [name, setName] = useState<string>("");
    const [customCards, setCustomCards] = useState<CardDetail[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardDetailWithColor | null>(null);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState("");
    const [newCardDuration, setNewCardDuration] = useState("");
    const [newCardDescription, setNewCardDescription] = useState("");
    const [newCardHabitType, setNewCardHabitType] = useState("Cardio");
    const [showHabitTypeModal, setShowHabitTypeModal] = useState(false);
    const habitTypes = ["Cardio", "Strength", "Meditation", "Study"];
    const [week, setWeek] = useState<Day[]>([]);

    // ---------------------------
    // Constants & Refs
    // ---------------------------
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentDay = today.getDay();

    const flatListRef = useRef<FlatList>(null);
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const Months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // ---------------------------
    // Helper Functions
    // ---------------------------

    const getUserData = async () => {
        const usersName = await AsyncStorage.getItem("name");
        setName(usersName ?? "");
    };

    const loadCustomCards = async () => {
        const stored = await AsyncStorage.getItem("customCards");
        if (stored) {
            setCustomCards(JSON.parse(stored));
        }
    };

    const saveCustomCards = async (cards: CardDetail[]) => {
        await AsyncStorage.setItem("customCards", JSON.stringify(cards));
    };

    const handleAddCard = async () => {
        if (!newCardTitle.trim()) {
            alert('Please enter a title.');
            return;
        }

        if (!newCardDuration.trim() || isNaN(Number(newCardDuration))) {
            alert('Please enter a valid number for duration.');
            return;
        }

        const duration = Number(newCardDuration);
        if (duration <= 0 || duration > 240) {
            alert('Duration should be between 1 and 240 minutes.');
            return;
        }

        if (!newCardDescription.trim()) {
            alert('Please enter a description.');
            return;
        }

        const newCard: CardDetail = {
            title: newCardTitle,
            description: newCardDescription,
            duration: newCardDuration,
            habitType: newCardHabitType // ✅ Save selected habit type
        };

        const updatedCards = [...customCards, newCard];
        setCustomCards(updatedCards);
        await saveCustomCards(updatedCards);

        setNewCardTitle("");
        setNewCardDescription("");
        setNewCardDuration("");
        setNewCardHabitType("Cardio"); // reset
        setShowAddCardModal(false);
    };


    const handleDeleteCard = async (indexToDelete: number) => {
        const updatedCards = [...customCards];
        updatedCards.splice(indexToDelete, 1);
        setCustomCards(updatedCards);
        await saveCustomCards(updatedCards);
    };

    const getDays = () => {
        const dateOfWeek: Day[] = [];
        const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < 7; i++) {
            let status = "", date = 0;
            const diff = i - currentDay;

            if (diff < 0) {
                status = "Past";
                date = currentDate + diff;
                if (date < 1) date = lastDayOfPrevMonth + date;
            } else if (diff === 0) {
                status = "Today";
                date = currentDate;
            } else {
                status = "Future";
                date = currentDate + diff;
                if (date > lastDayOfCurrentMonth) date = date - lastDayOfCurrentMonth;
            }

            dateOfWeek.push({ date, status, day: i });
        }

        setWeek(dateOfWeek);

        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: currentDay, animated: true });
        }, 100);
    };
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Past": return { backgroundColor: "#b7efb2" };
            case "Future": return { backgroundColor: "#e0e0e0" };
            default: return { backgroundColor: "#000000ff" }; // Today
        }
    };

    const getStatusText = (status: string) => status === "Today" ? { color: "#fff" } : {};

    // ---------------------------
    // useEffect on Mount
    // ---------------------------
    useEffect(() => {
        getUserData();
        getDays();
        loadCustomCards();
    }, []);
    useEffect(() => {
        setSelectedDayIndex(null);
    }, [week]);

    // ---------------------------
    // Render
    // ---------------------------
    return (
        <View style={styles.container}>
            {/* Header Greeting */}
            <Text style={styles.greeting}>Good Morning {name}</Text>
            <Text style={{ fontSize: 22, marginBottom: 10, marginLeft: 10 }}>
                {currentDate}, {Months[currentMonth]}
            </Text>

            {/* Day Strip */}
            <View style={{ height: 70, marginBottom: 10 }}>
                <FlatList
                    data={week}
                    ref={flatListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const isSelected = selectedDayIndex === index;
                        return (
                            <Pressable
                                style={[
                                    styles.dayBox,
                                    getStatusColor(item.status),
                                    isSelected && { backgroundColor: "#ff924e" } // selected highlight
                                ]}
                                onPress={() => setSelectedDayIndex(index)}
                            >
                                <Text style={[
                                    { fontSize: 18, fontWeight: 'bold' },
                                    getStatusText(item.status),
                                    isSelected && { color: "#fff" }
                                ]}>
                                    {item.date}
                                </Text>
                                <Text style={[
                                    { fontSize: 18, fontWeight: 'bold' },
                                    getStatusText(item.status),
                                    isSelected && { color: "#fff" }
                                ]}>
                                    {weekDay[item.day]}
                                </Text>
                            </Pressable>
                        );
                    }}
                />

            </View>

            {/* Add Card Button */}
            <Pressable style={styles.addButton} onPress={() => setShowAddCardModal(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            {/* Cards List */}
            <ScrollView style={{ flex: 1, marginBottom: 50, paddingBottom: 20 }}>
                <View style={{ paddingTop: 20, paddingHorizontal: 10 }}>
                    {[...customCards].reverse().map((item, index) => {
                        const bgColors = ["#82ccdd", "#f1a6a6ff", "#b8e994", "#f8c291"];
                        const cardBgColor = bgColors[index % bgColors.length];
                        const reversedIndex = customCards.length - 1 - index;

                        return (
                            <Pressable
                                key={index}
                                onPress={() => setSelectedCard({ ...item, backgroundColor: cardBgColor })}
                                style={[
                                    styles.Card,
                                    {
                                        backgroundColor: cardBgColor,
                                        marginTop: index === 0 ? 0 : -105,
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
                                    <Pressable onPress={() => handleDeleteCard(reversedIndex)}
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
                                <Text style={{ fontSize: 14, color: "#222", marginTop: 4 }}>Duration: {item.duration} min</Text>
                                <Text style={{ fontSize: 14, color: "#222", marginTop: 4 }}>
                                    Habit Type: {item.habitType}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
                                    <Text style={{ fontSize: 12, color: '#555' }}>Tap to view</Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            {/* View Card Modal */}
            {selectedCard && (
                <View style={styles.modalWrapper}>
                    <View style={styles.modalOverlay} onTouchEnd={() => setSelectedCard(null)} />
                    <View style={[styles.modalContent, { backgroundColor: selectedCard.backgroundColor }]}>
                        <Text style={styles.modalTitle}>{selectedCard.title}</Text>
                        <Text style={styles.modalDescription}>
                            {selectedCard.description}
                            {"\n\n"}Duration: {selectedCard.duration} min
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Text style={styles.modalClose} onPress={() => setSelectedCard(null)}>Close</Text>
                            <Text style={styles.startTimerButton} onPress={() => [setSelectedCard(null), navigation.navigate("TimerScreen", {
                                Title: selectedCard.title,
                                Description: selectedCard.description,
                                Duration: selectedCard.duration,
                                HabitTypes: selectedCard.habitType
                            })]}>Start</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Add Card Modal */}
            {showAddCardModal && (
                <View style={styles.modalWrapper}>
                    <View style={styles.modalOverlay} onTouchEnd={() => setShowAddCardModal(false)} />
                    <View style={[styles.modalContent, { backgroundColor: "#fff" }]}>
                        <Text style={styles.modalTitle}>New Card</Text>
                        <TextInput
                            placeholder="Title"
                            placeholderTextColor="#000"
                            style={styles.input}
                            value={newCardTitle}
                            onChangeText={setNewCardTitle}
                        />
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Duration (e.g. 30)"
                                placeholderTextColor="#999"
                                value={newCardDuration}
                                onChangeText={setNewCardDuration}
                                keyboardType="numeric"
                                style={{ flex: 1, padding: 10 }}
                            />
                            <Text style={styles.postfix}>min</Text>
                        </View>
                        <TextInput
                            placeholder="Description"
                            placeholderTextColor="#000"
                            style={styles.input}
                            value={newCardDescription}
                            onChangeText={setNewCardDescription}
                        />
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "flex-start", alignItems: "center",
                            width: "90%", gap: 10, marginBottom: 20
                        }} >
                            <Text>Habit Type:</Text>
                            <Pressable
                                onPress={() => setShowHabitTypeModal(true)} // ✅ open modal
                                style={{
                                    width: 100, height: 35,
                                    borderWidth: 1, borderRadius: 5,
                                    justifyContent: "center", alignItems: "center",
                                }}
                            >
                                <Text>{newCardHabitType}</Text>
                            </Pressable>
                        </View>

                        <Pressable onPress={handleAddCard} style={[styles.modalAdd, { marginTop: 10 }]}>
                            <Text style={{ color: "#fff" }}>Add Card</Text>
                        </Pressable>
                        {showHabitTypeModal && (
                            <View style={styles.modalWrapper}>
                                <View style={styles.modalOverlay} onTouchEnd={() => setShowHabitTypeModal(false)} />
                                <View style={[styles.modalContent, { backgroundColor: "#fff" }]}>
                                    <Text style={styles.modalTitle}>Select Habit Type</Text>
                                    {habitTypes.map((type, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => {
                                                setNewCardHabitType(type);
                                                setShowHabitTypeModal(false); // close modal
                                            }}
                                            style={{
                                                padding: 10,
                                                marginVertical: 5,
                                                borderWidth: 1,
                                                borderRadius: 8,
                                                width: "100%",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text>{type}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}

                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // ---------------------------
    // Layout Containers
    // ---------------------------
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    dayBox: {
        width: 60,
        height: 65,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        marginRight: 5,
    },

    // ---------------------------
    // Typography
    // ---------------------------
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
        marginLeft: 10
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#222",
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 16,
        color: "#444",
        lineHeight: 22,
    },

    // ---------------------------
    // Card Styles
    // ---------------------------
    Card: {
        borderRadius: 20,
        elevation: 8,
        height: 180,
        backgroundColor: "#fff",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },

    // ---------------------------
    // Modal Layout
    // ---------------------------
    modalWrapper: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
    },

    // ---------------------------
    // Modal Text
    // ---------------------------
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalClose: {
        fontSize: 16,
        backgroundColor: '#fc5a5aff',
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: "#000",
    },
    startTimerButton: {
        fontSize: 16,
        backgroundColor: '#58d03dff',
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: "#000",
    },
    modalAdd: {
        fontSize: 16,
        backgroundColor: '#8afc70ff',
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        textAlign: 'center',
    },

    // ---------------------------
    // Input Fields
    // ---------------------------
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    inputContainer: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 2,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        backgroundColor: '#fff',
    },
    postfix: {
        marginRight: 10,
        fontSize: 16,
        color: '#000',
    },

    // ---------------------------
    // Floating Add Button
    // ---------------------------
    addButton: {
        backgroundColor: "#7883f9ff",
        width: 40,
        height: 40,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
        marginRight: 16
    },
    addButtonText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    }
});

export default HomeScreen;
function alert(arg0: string) {
    throw new Error('Function not implemented.');
}

