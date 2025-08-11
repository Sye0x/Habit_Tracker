import React, { useState } from "react";
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


export default function SettingsScreen() {
    const navigation = useNavigation();

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

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

    return (
        <View style={{ padding: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 10, gap: 20, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.header}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>


                {/* Preferences Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Preferences</Text>

                    <View style={styles.optionRow}>
                        <View style={styles.optionLabel}>
                            <Text style={styles.optionText}>Dark Mode</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#bbb", true: "#4cd137" }}
                            thumbColor={darkMode ? "#2ecc71" : "#fff"}
                            value={darkMode}
                            onValueChange={setDarkMode}
                        />
                    </View>

                    <View style={styles.optionRow}>
                        <View style={styles.optionLabel}>
                            <Text style={styles.optionText}>Enable Notifications</Text>
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
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>General</Text>

                    <TouchableOpacity
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("AboutScreen" as never)}
                    >
                        <View style={styles.optionLabel}>
                            <Text style={styles.optionText}>About App</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("NotificationSettingsScreen" as never)}
                    >
                        <View style={styles.optionLabel}>
                            <Text style={styles.optionText}>Notification Settings</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionRow}
                        activeOpacity={0.7}
                        onPress={handleResetData}
                    >
                        <View style={styles.optionLabel}>
                            <Text style={[styles.optionText, { color: "#e74c3c" }]}>Reset All Data</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",

        color: "#333",
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
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "#222",
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
    icon: {
        marginRight: 14,
    },


});
