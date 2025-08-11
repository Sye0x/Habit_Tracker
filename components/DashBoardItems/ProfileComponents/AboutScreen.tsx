import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function AboutScreen() {
    const openWebsite = () => {
        // No URL provided, so do nothing or you can show an alert if you want
    };

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

            <Text style={[styles.text, { marginTop: 30 }]}>© 2025 Your Company. All rights reserved.</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        alignItems: "center",
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4a90e2",
        marginBottom: 8,
    },
    version: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: "#444",
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        alignSelf: "flex-start",
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
    },
    link: {
        fontSize: 14,
        color: "#999",
        fontStyle: "italic",
        marginTop: 5,
        textAlign: "center",
    },
});
