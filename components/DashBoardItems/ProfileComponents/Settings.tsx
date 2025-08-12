import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toggletheme } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from './../../redux/rootReducer';

export default function SettingsScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Get current theme from redux store
    const darkMode = useSelector((state: RootState) => state.theme);

    const [notifications, setNotifications] = React.useState(true);

    // Load persisted theme from AsyncStorage on mount
    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem("colorMode");
            if (savedTheme !== null) {
                const parsed = JSON.parse(savedTheme);
                // If redux theme differs from saved, sync redux
                if (parsed !== darkMode) {
                    dispatch(toggletheme(parsed));
                }
            }
        })();
    }, []);

    const handleResetData = () => {
        Alert.alert(
            "Reset Data",
            "Are you sure you want to reset all your habits and progress?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Reset",
                    style: "destructive",
                    onPress: () => console.log("Data Reset"),
                },
            ]
        );
    };

    const darkmodeSwitch = async () => {
        const newMode = !darkMode;
        dispatch(toggletheme(newMode)); // Update redux state
        await AsyncStorage.setItem("colorMode", JSON.stringify(newMode)); // Persist
    };

    return (
        <View style={[styles.container, darkMode && styles.containerDark]}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome
                        name="arrow-left"
                        size={24}
                        color={darkMode ? "#fff" : "#000"}
                    />
                </TouchableOpacity>
                <Text style={[styles.header, darkMode && styles.headerDark]}>
                    Settings
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Preferences Card */}
                <View style={[styles.card, darkMode && styles.cardDark]}>
                    <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
                        Preferences
                    </Text>

                    <View style={styles.optionRow}>
                        <View style={styles.optionLabel}>
                            <Text style={[styles.optionText, darkMode && styles.optionTextDark]}>
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#bbb", true: "#4cd137" }}
                            thumbColor={darkMode ? "#2ecc71" : "#fff"}
                            value={darkMode}
                            onValueChange={darkmodeSwitch}
                        />
                    </View>

                    <View style={styles.optionRow}>
                        <View style={styles.optionLabel}>
                            <Text style={[styles.optionText, darkMode && styles.optionTextDark]}>
                                Enable Notifications
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#bbb", true: "#4cd137" }}
                            thumbColor={notifications ? "#2ecc71" : "#fff"}
                            value={notifications}
                            onValueChange={setNotifications}
                        />
                    </View>
                </View>

                {/* Navigation Card */}
                <View style={[styles.card, darkMode && styles.cardDark]}>
                    <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
                        General
                    </Text>

                    <TouchableOpacity
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("AboutScreen" as never)}
                    >
                        <View style={styles.optionLabel}>
                            <Text style={[styles.optionText, darkMode && styles.optionTextDark]}>
                                About App
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("NotificationSettingsScreen" as never)}
                    >
                        <View style={styles.optionLabel}>
                            <Text style={[styles.optionText, darkMode && styles.optionTextDark]}>
                                Notification Settings
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={handleResetData}
                    >
                        <View style={styles.optionLabel}>
                            <Text
                                style={[
                                    styles.optionText,
                                    { color: "#e74c3c" },
                                    darkMode && { color: "#ff7675" },
                                ]}
                            >
                                Reset All Data
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

// ... keep your styles the same


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    containerDark: {
        backgroundColor: "#121212",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        gap: 20,
        marginBottom: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
    },
    headerDark: {
        color: "#eee",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 6,
    },
    cardDark: {
        backgroundColor: "#1e1e1e",
        shadowOpacity: 0.5,
        shadowColor: "#fff",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#222",
    },
    cardTitleDark: {
        color: "#ddd",
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionLabel: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
    optionTextDark: {
        color: "#ccc",
    },
});
