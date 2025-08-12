import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import DayandGreeting from './HomeComponent/DayandGreeting';
import ViewCardModal from './HomeComponent/ViewHabitCards';
import { useSelector } from 'react-redux';
import type { RootState } from './../redux/rootReducer';  // Adjust path
import { useDispatch } from 'react-redux';
import { toggletheme } from '../redux/action'; // adjust path if needed

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string;
    frequency: string;
    completed: boolean;
};

const lightTheme = {
    background: "#f0f4f8",
    modalBackground: "#fff",
    text: "#000",
    border: "#ccc",
    placeholder: "#aaa",
    overlay: "rgba(0,0,0,0.5)",
    addButton: "#7883f9",
    addButtonText: "#fff",
    modalAdd: "#8afc70"
};

const darkTheme = {
    background: "#121212",
    modalBackground: "#1e1e1e",
    text: "#fff",
    border: "#444",
    placeholder: "#888",
    overlay: "rgba(255,255,255,0.1)",
    addButton: "#4f5bd5",
    addButtonText: "#fff",
    modalAdd: "#4caf50"
};

function HomeScreen({ navigation }: any) {
    const darkMode = useSelector((state: RootState) => state.theme);
    const theme = darkMode ? darkTheme : lightTheme;
    useEffect(() => { resetHabitsIfNeeded(); }, []);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem("colorMode");
            if (savedTheme !== null) {
                const parsedTheme = JSON.parse(savedTheme);
                if (parsedTheme !== darkMode) {
                    dispatch(toggletheme(parsedTheme));
                }
            }
            // After syncing theme, load cards and reset habits
            await loadCustomCards();
            await resetHabitsIfNeeded();
        })();
    }, []);

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
    const [durationSeconds, setDurationSeconds] = useState("");

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

        const todayStr = today.toISOString().split("T")[0];
        if (lastReset.daily !== todayStr) {
            cards = cards.map(c => c.frequency === "Daily" ? { ...c, completed: false } : c);
            lastReset.daily = todayStr;
        }

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

        const currentMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;
        if (lastReset.monthly !== currentMonth) {
            cards = cards.map(c => c.frequency === "Monthly" ? { ...c, completed: false } : c);
            lastReset.monthly = currentMonth;
        }

        await AsyncStorage.setItem("customCards", JSON.stringify(cards));
        await AsyncStorage.setItem("lastResetDates", JSON.stringify(lastReset));
        setCustomCards(cards);
    };

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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <DayandGreeting />
            <Pressable style={[styles.addButton, { backgroundColor: theme.addButton }]} onPress={() => setShowAddCardModal(true)}>
                <Text style={[styles.addButtonText, { color: theme.addButtonText }]}>+</Text>
            </Pressable>
            <ViewCardModal customCards={customCards} setCustomCards={setCustomCards} navigation={navigation} />

            {showAddCardModal && (
                <View style={styles.modalWrapper}>
                    <TouchableOpacity
                        style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}
                        onPress={() => setShowAddCardModal(false)}
                        activeOpacity={1}
                    />
                    <ScrollView style={{ width: '80%', maxHeight: '80%' }} contentContainerStyle={{ paddingBottom: 20, marginLeft: 20 }} showsVerticalScrollIndicator={false}>
                        <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>New Card</Text>
                            <TextInput
                                placeholder="Title"
                                placeholderTextColor={theme.placeholder}
                                style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                                value={newCardTitle}
                                onChangeText={setNewCardTitle}
                            />
                            <View style={styles.durationRow}>
                                <TextInput
                                    placeholder="HH"
                                    placeholderTextColor={theme.placeholder}
                                    keyboardType="numeric"
                                    value={durationHours}
                                    onChangeText={setDurationHours}
                                    style={[styles.durationBox, { borderColor: theme.border, color: theme.text }]}
                                    maxLength={2}
                                />
                                <Text style={[styles.timeColon, { color: theme.text }]}>:</Text>
                                <TextInput
                                    placeholder="MM"
                                    placeholderTextColor={theme.placeholder}
                                    keyboardType="numeric"
                                    value={durationMinutes}
                                    onChangeText={setDurationMinutes}
                                    style={[styles.durationBox, { borderColor: theme.border, color: theme.text }]}
                                    maxLength={2}
                                />
                                <Text style={[styles.timeColon, { color: theme.text }]}>:</Text>
                                <TextInput
                                    placeholder="SS"
                                    placeholderTextColor={theme.placeholder}
                                    keyboardType="numeric"
                                    value={durationSeconds}
                                    onChangeText={setDurationSeconds}
                                    style={[styles.durationBox, { borderColor: theme.border, color: theme.text }]}
                                    maxLength={2}
                                />
                            </View>

                            <TextInput
                                placeholder="Description"
                                placeholderTextColor={theme.placeholder}
                                style={[styles.input, { height: 80, textAlignVertical: 'top', borderColor: theme.border, color: theme.text }]}
                                value={newCardDescription}
                                onChangeText={setNewCardDescription}
                                multiline
                            />
                            <View style={styles.dropdownWrapper}>
                                <TouchableOpacity
                                    onPress={() => { setShowHabitTypeModal(true); setShowHabitFrequencyModal(false); }}
                                    style={[styles.dropdownButton, { borderColor: theme.border, backgroundColor: theme.modalBackground }]}
                                >
                                    <Text style={[styles.dropdownText, { color: theme.text }]}>{newCardHabitType}</Text>
                                    <FontAwesome name="caret-down" size={16} color={theme.text} />
                                </TouchableOpacity>
                                {showHabitTypeOption && (
                                    <View style={[styles.dropdownOptions, { borderColor: theme.border, backgroundColor: theme.modalBackground }]}>
                                        {habitTypes.map((type, i) => (
                                            <TouchableOpacity key={i} onPress={() => { setNewCardHabitType(type); setShowHabitTypeModal(false); }} style={styles.dropdownOption}>
                                                <Text style={{ color: theme.text }}>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={styles.dropdownWrapper}>
                                <TouchableOpacity
                                    onPress={() => { setShowHabitFrequencyModal(true); setShowHabitTypeModal(false); }}
                                    style={[styles.dropdownButton, { borderColor: theme.border, backgroundColor: theme.modalBackground }]}
                                >
                                    <Text style={[styles.dropdownText, { color: theme.text }]}>{newCardHabitFrequency}</Text>
                                    <FontAwesome name="caret-down" size={16} color={theme.text} />
                                </TouchableOpacity>
                                {showHabitFrequencyModal && (
                                    <View style={[styles.dropdownOptions, { borderColor: theme.border, backgroundColor: theme.modalBackground }]}>
                                        {habitFrequency.map((freq, i) => (
                                            <TouchableOpacity key={i} onPress={() => { setNewCardHabitFrequency(freq); setShowHabitFrequencyModal(false); }} style={styles.dropdownOption}>
                                                <Text style={{ color: theme.text }}>{freq}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity onPress={handleAddCard} style={[styles.modalAdd, { backgroundColor: theme.modalAdd }]}>
                                <Text style={[styles.modalAddText, { color: theme.text }]}>Add Card</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    modalWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    modalContent: { width: '90%', maxWidth: 350, borderRadius: 20, padding: 20, elevation: 10 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    input: { width: '100%', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 16 },
    durationRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    durationBox: { borderWidth: 1, borderRadius: 8, padding: 10, width: 60, textAlign: "center", fontSize: 16 },
    timeColon: { fontSize: 18, fontWeight: "bold", marginHorizontal: 5 },
    dropdownWrapper: { width: '100%', marginBottom: 10 },
    dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15 },
    dropdownText: { fontSize: 16 },
    dropdownOptions: { width: '100%', marginTop: 5, borderWidth: 1, borderRadius: 10, maxHeight: 150 },
    dropdownOption: { paddingVertical: 8, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalAdd: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 16, width: '100%' },
    modalAddText: { fontSize: 16, fontWeight: 'bold' },
    addButton: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginBottom: 10, elevation: 5 },
    addButtonText: { fontSize: 28, fontWeight: "bold" },
});

export default HomeScreen;
