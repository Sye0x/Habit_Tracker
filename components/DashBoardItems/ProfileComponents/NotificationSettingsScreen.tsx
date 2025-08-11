import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    ScrollView,
} from "react-native";

export default function NotificationSettingsScreen() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Notification Settings</Text>

            <View style={styles.optionRow}>
                <Text style={styles.optionText}>Push Notifications</Text>
                <Switch
                    trackColor={{ false: "#bbb", true: "#4cd137" }}
                    thumbColor={pushEnabled ? "#2ecc71" : "#fff"}
                    value={pushEnabled}
                    onValueChange={setPushEnabled}
                />
            </View>

            <View style={styles.optionRow}>
                <Text style={styles.optionText}>Email Notifications</Text>
                <Switch
                    trackColor={{ false: "#bbb", true: "#4cd137" }}
                    thumbColor={emailEnabled ? "#2ecc71" : "#fff"}
                    value={emailEnabled}
                    onValueChange={setEmailEnabled}
                />
            </View>

            {/* Add more notification options here */}

        </ScrollView>
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
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#333",
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 17,
        color: "#333",
    },
});
