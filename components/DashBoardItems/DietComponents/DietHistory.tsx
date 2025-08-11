import React, { useState, useCallback } from "react";
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
    const [history, setHistory] = useState<CalorieEntry[]>([]);

    const loadHistory = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const dataArray: CalorieEntry[] = JSON.parse(stored);
                // Sort by date descending
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
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all history?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem(STORAGE_KEY);
                        setHistory([]);
                    },
                },
            ]
        );
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
        ? Math.round(
            history.reduce((sum, entry) => sum + entry.totalCalories, 0) /
            history.length
        )
        : 0;

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    if (history.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>History</Text>
                <Text style={styles.noDataText}>
                    No history yet. Start tracking to see your progress! 📊
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>History</Text>

                {/* Average Calories */}
                <Text style={styles.avgText}>
                    Average Calories: {averageCalories} kcal/day
                </Text>

                {/* History List */}
                {history.map((entry) => (
                    <View key={entry.date} style={styles.entryBox}>
                        <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Breakfast:</Text>
                            <Text style={styles.value}>{entry.breakfast} kcal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Lunch:</Text>
                            <Text style={styles.value}>{entry.lunch} kcal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Dinner:</Text>
                            <Text style={styles.value}>{entry.dinner} kcal</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Snacks:</Text>
                            <Text style={styles.value}>{entry.snacks} kcal</Text>
                        </View>
                        <View style={[styles.row, styles.totalRow]}>
                            <Text style={[styles.label, styles.totalLabel]}>Total:</Text>
                            <Text style={[styles.value, styles.totalValue]}>
                                {entry.totalCalories} kcal
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Floating Clear History Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={clearHistory}>
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
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 15,
        color: "#2d3436",
    },
    noDataText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 40,
        color: "#636e72",
    },
    avgText: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 10,
        color: "#6c5ce7",
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
    dateText: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 10,
        color: "#0984e3",
        textAlign: "center",
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
    value: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2d3436",
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
    totalValue: {
        fontSize: 16,
        color: "#0984e3",
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
    floatingButtonText: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
});
