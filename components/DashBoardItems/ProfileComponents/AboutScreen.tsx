import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../../redux/action";  // adjust path
import type { RootState } from "../../redux/rootReducer";  // adjust path

export default function AboutScreen() {
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

    const openWebsite = () => {
        // No URL provided; do nothing or add alert
    };

    const styles = getStyles(darkMode);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Habit Tracker</Text>

            <Text style={styles.version}>Version 1.0.0</Text>

            <Text style={styles.description}>
                Habit Tracker helps you build positive habits and track your progress daily.
                Stay motivated and reach your goals with easy-to-use features.
            </Text>

            <Text style={styles.sectionTitle}>Contact & Support</Text>

            <Text style={styles.text}>For more info or support, visit our website:</Text>
            <TouchableOpacity onPress={openWebsite}>
                <Text style={styles.link}>[Website URL not available]</Text>
            </TouchableOpacity>

            <Text style={[styles.text, { marginTop: 30 }]}>
                © 2025 Your Company. All rights reserved.
            </Text>
        </ScrollView>
    );
}

const getStyles = (darkMode: boolean) =>
    StyleSheet.create({
        container: {
            padding: 30,
            alignItems: "center",
            backgroundColor: darkMode ? "#121212" : "#fff",
            flexGrow: 1,
        },
        title: {
            fontSize: 28,
            fontWeight: "bold",
            color: darkMode ? "#74a9ff" : "#4a90e2",
            marginBottom: 8,
        },
        version: {
            fontSize: 16,
            color: darkMode ? "#aaa" : "#666",
            marginBottom: 20,
        },
        description: {
            fontSize: 16,
            color: darkMode ? "#ccc" : "#444",
            textAlign: "center",
            marginBottom: 30,
            lineHeight: 22,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 10,
            alignSelf: "flex-start",
            color: darkMode ? "#ddd" : "#333",
        },
        text: {
            fontSize: 14,
            color: darkMode ? "#bbb" : "#555",
            textAlign: "center",
        },
        link: {
            fontSize: 14,
            color: darkMode ? "#888" : "#999",
            fontStyle: "italic",
            marginTop: 5,
            textAlign: "center",
        },
    });
