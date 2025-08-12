import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    ScrollView,
    useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../../redux/action";  // adjust path
import type { RootState } from "../../redux/rootReducer";  // adjust path
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function NotificationSettingsScreen() {
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

    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    return (
        <ScrollView
            style={[styles.container, darkMode && styles.containerDark]}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            <Text style={[styles.header, darkMode && styles.headerDark]}>
                Notification Settings
            </Text>

            <View style={[styles.optionRow, darkMode && styles.optionRowDark]}>
                <Text style={[styles.optionText, darkMode && styles.optionTextDark]}>
                    Push Notifications
                </Text>
                <Switch
                    trackColor={{ false: "#555", true: "#4cd137" }}
                    thumbColor={pushEnabled ? "#2ecc71" : "#fff"}
                    value={pushEnabled}
                    onValueChange={setPushEnabled}
                />
            </View>

            <View style={[styles.optionRow, darkMode && styles.optionRowDark]}>
                <Text style={[styles.optionText, darkMode && styles.optionTextDark]}>
                    Email Notifications
                </Text>
                <Switch
                    trackColor={{ false: "#555", true: "#4cd137" }}
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
    containerDark: {
        backgroundColor: "#121212",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#333",
    },
    headerDark: {
        color: "#eee",
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionRowDark: {
        borderBottomColor: "#333",
    },
    optionText: {
        fontSize: 17,
        color: "#333",
    },
    optionTextDark: {
        color: "#ddd",
    },
});
