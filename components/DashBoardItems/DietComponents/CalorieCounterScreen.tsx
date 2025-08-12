import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../../redux/action"; // Adjust path
import type { RootState } from "../../redux/rootReducer"; // Adjust path

const STORAGE_KEY = "@calorie_counter_data_array";

type MealName = "breakfast" | "lunch" | "dinner" | "snacks";
type ErrorsType = Record<MealName | "targetCalories", string>;

export default function CalorieCounterScreen() {
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

    const [breakfast, setBreakfast] = useState("");
    const [lunch, setLunch] = useState("");
    const [dinner, setDinner] = useState("");
    const [snacks, setSnacks] = useState("");
    const [targetCalories, setTargetCalories] = useState("2000");

    const [errors, setErrors] = useState<ErrorsType>({
        breakfast: "",
        lunch: "",
        dinner: "",
        snacks: "",
        targetCalories: "",
    });

    function validateInput(name: string, value: string) {
        if (value === "") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
            return true;
        }
        const num = Number(value);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
            setErrors((prev) => ({
                ...prev,
                [name]: "Please enter a valid positive integer",
            }));
            return false;
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
            return true;
        }
    }

    function handleChange(name: string, value: string, setter: (v: string) => void) {
        if (validateInput(name, value)) {
            setter(value);
        }
    }

    const totalCalories =
        (parseInt(breakfast) || 0) +
        (parseInt(lunch) || 0) +
        (parseInt(dinner) || 0) +
        (parseInt(snacks) || 0);

    const targetCalorieNum = parseInt(targetCalories) || 0;

    const saveData = async () => {
        if (Object.values(errors).some((e) => e.length > 0) || targetCalorieNum === 0) {
            Alert.alert(
                "Invalid input",
                "Please fix all errors and set a valid target calorie amount."
            );
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        const entry = {
            breakfast: parseInt(breakfast) || 0,
            lunch: parseInt(lunch) || 0,
            dinner: parseInt(dinner) || 0,
            snacks: parseInt(snacks) || 0,
            totalCalories: totalCalories,
            date: today,
        };

        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            let dataArray = stored ? JSON.parse(stored) : [];

            const existingIndex = dataArray.findIndex((item: any) => item.date === today);

            if (existingIndex !== -1) {
                dataArray[existingIndex] = entry;
            } else {
                dataArray.push(entry);
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataArray));
            Alert.alert("Success", "Your calorie data has been saved.");
        } catch (e) {
            Alert.alert("Error", "Failed to save data.");
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    const stored = await AsyncStorage.getItem(STORAGE_KEY);
                    if (stored && isActive) {
                        const dataArray = JSON.parse(stored);
                        const today = new Date().toISOString().split("T")[0];
                        const todayEntry = dataArray.find((item: any) => item.date === today);

                        if (todayEntry) {
                            setBreakfast(todayEntry.breakfast.toString());
                            setLunch(todayEntry.lunch.toString());
                            setDinner(todayEntry.dinner.toString());
                            setSnacks(todayEntry.snacks.toString());
                        } else {
                            setBreakfast("");
                            setLunch("");
                            setDinner("");
                            setSnacks("");
                        }
                    }
                } catch {
                    // ignore
                }
            })();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const clearAll = async () => {
        setBreakfast("");
        setLunch("");
        setDinner("");
        setSnacks("");
        setTargetCalories("2000");
        setErrors({
            breakfast: "",
            lunch: "",
            dinner: "",
            snacks: "",
            targetCalories: "",
        });
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            Alert.alert("Success", "All saved data cleared.");
        } catch {
            // ignore
        }
    };

    const progressWidth =
        targetCalorieNum > 0 ? Math.min((totalCalories / targetCalorieNum) * 100, 100) : 0;

    return (
        <KeyboardAvoidingView
            style={[styles.screen, darkMode && styles.screenDark]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled">
                <Text style={[styles.header, darkMode && styles.headerDark]}>Calorie Counter</Text>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, darkMode && styles.labelDark]}>
                        Set your daily calorie target (kcal)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.targetCalories && styles.inputError,
                            darkMode && styles.inputDark,
                        ]}
                        keyboardType="numeric"
                        placeholder="e.g. 2000"
                        placeholderTextColor={darkMode ? "#aaa" : undefined}
                        value={targetCalories}
                        onChangeText={(v) => handleChange("targetCalories", v, setTargetCalories)}
                    />
                    {errors.targetCalories ? (
                        <Text style={styles.errorText}>{errors.targetCalories}</Text>
                    ) : null}

                    {(["breakfast", "lunch", "dinner", "snacks"] as MealName[]).map((meal) => {
                        const label = meal.charAt(0).toUpperCase() + meal.slice(1) + " (kcal)";
                        const value = { breakfast, lunch, dinner, snacks }[meal];
                        const error = errors[meal];
                        const setter = {
                            breakfast: setBreakfast,
                            lunch: setLunch,
                            dinner: setDinner,
                            snacks: setSnacks,
                        }[meal];

                        return (
                            <View key={meal} style={styles.inputGroup}>
                                <Text style={[styles.label, darkMode && styles.labelDark]}>{label}</Text>
                                <TextInput
                                    style={[styles.input, error && styles.inputError, darkMode && styles.inputDark]}
                                    keyboardType="numeric"
                                    placeholder={`Enter ${meal} calories`}
                                    placeholderTextColor={darkMode ? "#aaa" : undefined}
                                    value={value}
                                    onChangeText={(v) => handleChange(meal, v, setter)}
                                />
                                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            </View>
                        );
                    })}
                </View>

                <View style={styles.progressContainer}>
                    <View
                        style={[
                            styles.progressBarBackground,
                            darkMode && styles.progressBarBackgroundDark,
                        ]}
                    >
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progressWidth}%` },
                                progressWidth > 100 && { backgroundColor: "#d63031" },
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressText, darkMode && styles.progressTextDark]}>
                        {totalCalories} / {targetCalorieNum} kcal
                    </Text>
                </View>

                <View style={styles.totalContainer}>
                    <Text style={[styles.totalText, darkMode && styles.totalTextDark]}>
                        Total Calories Consumed:{" "}
                    </Text>
                    <Text style={[styles.totalValue, darkMode && styles.totalValueDark]}>
                        {totalCalories} kcal
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={saveData}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
                        <Text style={styles.buttonText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f0f4f8", padding: 20 },
    screenDark: { backgroundColor: "#121212" },
    container: { paddingBottom: 30 },

    header: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#2d3436",
    },
    headerDark: {
        color: "#eee",
    },

    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        color: "#2d3436",
    },
    labelDark: {
        color: "#eee",
    },

    input: {
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        color: "#2d3436",
    },
    inputDark: {
        backgroundColor: "#1e1e1e",
        color: "#eee",
        shadowOpacity: 0.3,
    },
    inputError: {
        borderWidth: 1,
        borderColor: "#d63031",
    },

    errorText: {
        color: "#d63031",
        marginTop: 4,
        fontSize: 13,
        fontWeight: "600",
    },

    progressContainer: {
        marginTop: 30,
        alignItems: "center",
    },
    progressBarBackground: {
        width: "90%",
        height: 25,
        backgroundColor: "#dfe6e9",
        borderRadius: 12,
        overflow: "hidden",
    },
    progressBarBackgroundDark: {
        backgroundColor: "#333",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#0984e3",
    },
    progressText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#2d3436",
    },
    progressTextDark: {
        color: "#eee",
    },

    totalContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 25,
    },
    totalText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2d3436",
    },
    totalTextDark: {
        color: "#eee",
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#0984e3",
    },
    totalValueDark: {
        color: "#74b9ff",
    },

    buttonsContainer: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    saveButton: {
        backgroundColor: "#00b894",
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 30,
        elevation: 3,
    },
    clearButton: {
        backgroundColor: "#d63031",
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 30,
        elevation: 3,
    },
    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
        textAlign: "center",
    },
});
