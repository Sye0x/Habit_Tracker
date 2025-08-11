// HomeScreen.tsx
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import DayandGreeting from './HomeComponent/DayandGreeting';
import ViewCardModal from './HomeComponent/ViewHabitCards';
import { FontAwesome5 } from "@react-native-vector-icons/fontawesome5";

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string; // total seconds
    frequency: string;
    completed: boolean;
};

function HomeScreen({ navigation }: any) {
    const [customCards, setCustomCards] = useState<CardDetail[]>([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState("");
    const [durationHours, setDurationHours] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("");
    const [newCardDescription, setNewCardDescription] = useState("");
    const [newCardHabitType, setNewCardHabitType] = useState("Cardio");
    const [newCardHabitFrequency, setNewCardHabitFrequency] = useState("Daily");
    const [showHabitTypeOption, setShowHabitTypeModal] = useState(false);
    const [showHabitFrequencyModal, setShowHabitFrequencyModal] = useState(false);

    const habitTypes = ["Cardio", "Strength", "Meditation", "Study"];
    const habitFrequency = ["Daily", "Weekly", "Monthly"];

    const loadCustomCards = async () => {
        const stored = await AsyncStorage.getItem("customCards");
        if (stored) setCustomCards(JSON.parse(stored));
    };

    const saveCustomCards = async (cards: CardDetail[]) => {
        await AsyncStorage.setItem("customCards", JSON.stringify(cards));
    };

    const resetHabitsIfNeeded = async () => {
        const stored = await AsyncStorage.getItem("customCards");
        if (!stored) return;
        let cards: CardDetail[] = JSON.parse(stored);

        const lastResetStr = await AsyncStorage.getItem("lastResetDates");
        let lastReset = lastResetStr ? JSON.parse(lastResetStr) : { daily: null, weekly: null, monthly: null };
        const today = new Date();

        // Daily reset
        const todayStr = today.toISOString().split("T")[0];
        if (lastReset.daily !== todayStr) {
            cards = cards.map(c => c.frequency === "Daily" ? { ...c, completed: false } : c);
            lastReset.daily = todayStr;
        }

        // Weekly reset
        const getWeekString = (d: Date) => {
            const year = d.getFullYear();
            const firstJan = new Date(year, 0, 1);
            const days = Math.floor((d.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000));
            const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
            return `${year}-W${week}`;
        };
        const currentWeek = getWeekString(today);
        if (lastReset.weekly !== currentWeek) {
            cards = cards.map(c => c.frequency === "Weekly" ? { ...c, completed: false } : c);
            lastReset.weekly = currentWeek;
        }

        // Monthly reset
        const currentMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;
        if (lastReset.monthly !== currentMonth) {
            cards = cards.map(c => c.frequency === "Monthly" ? { ...c, completed: false } : c);
            lastReset.monthly = currentMonth;
        }

        await AsyncStorage.setItem("customCards", JSON.stringify(cards));
        await AsyncStorage.setItem("lastResetDates", JSON.stringify(lastReset));
        setCustomCards(cards);
    };

    const [durationSeconds, setDurationSeconds] = useState("");

    const handleAddCard = async () => {
        if (!newCardTitle.trim()) {
            Alert.alert('Please enter a title.');
            return;
        }

        const hours = parseInt(durationHours || "0", 10);
        const minutes = parseInt(durationMinutes || "0", 10);
        const seconds = parseInt(durationSeconds || "0", 10);

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalSeconds <= 0) {
            Alert.alert('Please enter a valid duration greater than 0.');
            return;
        }
        if (totalSeconds > 86400) {
            Alert.alert('Duration should be less than 24 hours.');
            return;
        }

        if (!newCardDescription.trim()) {
            Alert.alert('Please enter a description.');
            return;
        }

        const newCard: CardDetail = {
            title: newCardTitle,
            description: newCardDescription,
            duration: totalSeconds.toString(),
            habitType: newCardHabitType,
            frequency: newCardHabitFrequency,
            completed: false,
        };

        const updatedCards = [...customCards, newCard];
        setCustomCards(updatedCards);
        await saveCustomCards(updatedCards);

        // Reset inputs
        setNewCardTitle("");
        setNewCardDescription("");
        setDurationHours("");
        setDurationMinutes("");
        setDurationSeconds("");
        setNewCardHabitType("Cardio");
        setNewCardHabitFrequency("Daily");
        setShowAddCardModal(false);
    };


    useEffect(() => { resetHabitsIfNeeded(); }, []);

    return (
        <View style={styles.container}>
            <DayandGreeting />
            <Pressable style={styles.addButton} onPress={() => setShowAddCardModal(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>
            <ViewCardModal customCards={customCards} setCustomCards={setCustomCards} navigation={navigation} />

            {showAddCardModal && (
                <View style={styles.modalWrapper}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setShowAddCardModal(false)}
                        activeOpacity={1}
                    />
                    <ScrollView style={{ width: '80%', maxHeight: '80%' }} contentContainerStyle={{ paddingBottom: 20, marginLeft: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>New Card</Text>
                            <TextInput
                                placeholder="Title"
                                placeholderTextColor="#aaa"
                                style={styles.input}
                                value={newCardTitle}
                                onChangeText={setNewCardTitle}
                            />
                            <View style={styles.durationRow}>
                                <TextInput
                                    placeholder="HH"
                                    placeholderTextColor="#aaa"
                                    keyboardType="numeric"
                                    value={durationHours}
                                    onChangeText={setDurationHours}
                                    style={styles.durationBox}
                                    maxLength={2}
                                />
                                <Text style={styles.timeColon}>:</Text>
                                <TextInput
                                    placeholder="MM"
                                    placeholderTextColor="#aaa"
                                    keyboardType="numeric"
                                    value={durationMinutes}
                                    onChangeText={setDurationMinutes}
                                    style={styles.durationBox}
                                    maxLength={2}
                                />
                                <Text style={styles.timeColon}>:</Text>
                                <TextInput
                                    placeholder="SS"
                                    placeholderTextColor="#aaa"
                                    keyboardType="numeric"
                                    value={durationSeconds}
                                    onChangeText={setDurationSeconds}
                                    style={styles.durationBox}
                                    maxLength={2}
                                />
                            </View>

                            <TextInput
                                placeholder="Description"
                                placeholderTextColor="#aaa"
                                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                value={newCardDescription}
                                onChangeText={setNewCardDescription}
                                multiline
                            />
                            <View style={styles.dropdownWrapper}>
                                <TouchableOpacity
                                    onPress={() => { setShowHabitTypeModal(true); setShowHabitFrequencyModal(false); }}
                                    style={styles.dropdownButton}
                                >
                                    <Text style={styles.dropdownText}>{newCardHabitType}</Text>
                                    <FontAwesome name="caret-down" size={16} color="#555" />
                                </TouchableOpacity>
                                {showHabitTypeOption && (
                                    <View style={styles.dropdownOptions}>
                                        {habitTypes.map((type, i) => (
                                            <TouchableOpacity key={i} onPress={() => { setNewCardHabitType(type); setShowHabitTypeModal(false); }} style={styles.dropdownOption}>
                                                <Text>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={styles.dropdownWrapper}>
                                <TouchableOpacity
                                    onPress={() => { setShowHabitFrequencyModal(true); setShowHabitTypeModal(false); }}
                                    style={styles.dropdownButton}
                                >
                                    <Text style={styles.dropdownText}>{newCardHabitFrequency}</Text>
                                    <FontAwesome name="caret-down" size={16} color="#555" />
                                </TouchableOpacity>
                                {showHabitFrequencyModal && (
                                    <View style={styles.dropdownOptions}>
                                        {habitFrequency.map((freq, i) => (
                                            <TouchableOpacity key={i} onPress={() => { setNewCardHabitFrequency(freq); setShowHabitFrequencyModal(false); }} style={styles.dropdownOption}>
                                                <Text>{freq}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity onPress={handleAddCard} style={styles.modalAdd}>
                                <Text style={styles.modalAddText}>Add Card</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f0f4f8", },
    modalWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', maxWidth: 350, borderRadius: 20, padding: 20, backgroundColor: '#fff', elevation: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    input: { width: '100%', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 16 },
    durationRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    durationBox: { borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10, width: 60, textAlign: "center", fontSize: 16 },
    timeColon: { fontSize: 18, fontWeight: "bold", marginHorizontal: 5 },
    dropdownWrapper: { width: '100%', marginBottom: 10 },
    dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#fff' },
    dropdownText: { fontSize: 16, color: '#000' },
    dropdownOptions: { width: '100%', marginTop: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', maxHeight: 150 },
    dropdownOption: { paddingVertical: 8, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalAdd: { backgroundColor: '#8afc70', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 16, width: '100%' },
    modalAddText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    addButton: { backgroundColor: "#7883f9", width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginBottom: 10, elevation: 5 },
    addButtonText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
});

export default HomeScreen;
