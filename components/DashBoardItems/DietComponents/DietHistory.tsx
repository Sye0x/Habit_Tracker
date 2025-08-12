import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../../redux/action"; // adjust path as needed
import type { RootState } from "../../redux/rootReducer"; // adjust path as needed

const STORAGE_KEY = "@calorie_counter_data_array";

type CalorieEntry = {
    date: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
    totalCalories: number;
};

export default function DietHistory() {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme);

    const [history, setHistory] = useState<CalorieEntry[]>([]);

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

    const loadHistory = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const dataArray: CalorieEntry[] = JSON.parse(stored);
                dataArray.sort((a, b) => (b.date > a.date ? 1 : -1));
                setHistory(dataArray);
            } else {
                setHistory([]);
            }
        } catch (e) {
            Alert.alert("Error", "Failed to load history.");
        }
    };

    const clearHistory = async () => {
        Alert.alert("Clear History", "Are you sure you want to delete all history?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Yes",
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.removeItem(STORAGE_KEY);
                    setHistory([]);
                },
            },
        ]);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const averageCalories = history.length
        ? Math.round(history.reduce((sum, entry) => sum + entry.totalCalories, 0) / history.length)
        : 0;

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    if (history.length === 0) {
        return (
            <View style={[styles.container, darkMode && styles.containerDark]}>
                <Text style={[styles.heading, darkMode && styles.headingDark]}>History</Text>
                <Text style={[styles.noDataText, darkMode && styles.noDataTextDark]}>
                    No history yet. Start tracking to see your progress! 📊
                </Text>
            </View>
        );
    }

    return (
        <View style={[{ flex: 1 }, darkMode && { backgroundColor: "#121212" }]}>
            <ScrollView contentContainerStyle={[styles.container, darkMode && styles.containerDark]}>
                <Text style={[styles.heading, darkMode && styles.headingDark]}>History</Text>

                <Text style={[styles.avgText, darkMode && styles.avgTextDark]}>
                    Average Calories: {averageCalories} kcal/day
                </Text>

                {history.map((entry) => (
                    <View key={entry.date} style={[styles.entryBox, darkMode && styles.entryBoxDark]}>
                        <Text style={[styles.dateText, darkMode && styles.dateTextDark]}>{formatDate(entry.date)}</Text>
                        <View style={styles.row}>
                            <Text style={[styles.label, darkMode && styles.labelDark]}>Breakfast:</Text>
                            <Text style={[styles.value, darkMode && styles.valueDark]}>{entry.breakfast} kcal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.label, darkMode && styles.labelDark]}>Lunch:</Text>
                            <Text style={[styles.value, darkMode && styles.valueDark]}>{entry.lunch} kcal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.label, darkMode && styles.labelDark]}>Dinner:</Text>
                            <Text style={[styles.value, darkMode && styles.valueDark]}>{entry.dinner} kcal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.label, darkMode && styles.labelDark]}>Snacks:</Text>
                            <Text style={[styles.value, darkMode && styles.valueDark]}>{entry.snacks} kcal</Text>
                        </View>
                        <View style={[styles.row, styles.totalRow]}>
                            <Text
                                style={[
                                    styles.label,
                                    styles.totalLabel,
                                    darkMode && styles.totalLabelDark,
                                ]}
                            >
                                Total:
                            </Text>
                            <Text
                                style={[
                                    styles.value,
                                    styles.totalValue,
                                    darkMode && styles.totalValueDark,
                                ]}
                            >
                                {entry.totalCalories} kcal
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={[styles.floatingButton, darkMode && styles.floatingButtonDark]}
                onPress={clearHistory}
            >
                <Text style={styles.floatingButtonText}>🗑</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 80, // leave space for floating button
        backgroundColor: "#f0f4f8",
        minHeight: "100%",
    },
    containerDark: {
        backgroundColor: "#121212",
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 15,
        color: "#2d3436",
    },
    headingDark: {
        color: "#eeeeee",
    },
    noDataText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 40,
        color: "#636e72",
    },
    noDataTextDark: {
        color: "#bbbbbb",
    },
    avgText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
        color: "#6c5ce7",
    },
    avgTextDark: {
        color: "#a29bfe",
    },
    entryBox: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    entryBoxDark: {
        backgroundColor: "#1e1e1e",
        shadowColor: "#000",
        shadowOpacity: 0.7,
        shadowRadius: 8,
    },
    dateText: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 10,
        color: "#0984e3",
        textAlign: "center",
    },
    dateTextDark: {
        color: "#74b9ff",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2d3436",
    },
    labelDark: {
        color: "#dfe6e9",
    },
    value: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2d3436",
    },
    valueDark: {
        color: "#dfe6e9",
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "#dfe6e9",
        paddingTop: 8,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        color: "#0984e3",
    },
    totalLabelDark: {
        color: "#74b9ff",
    },
    totalValue: {
        fontSize: 16,
        color: "#0984e3",
    },
    totalValueDark: {
        color: "#74b9ff",
    },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#d63031",
        borderRadius: 30,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
    floatingButtonDark: {
        backgroundColor: "#e17055",
    },
    floatingButtonText: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
});
