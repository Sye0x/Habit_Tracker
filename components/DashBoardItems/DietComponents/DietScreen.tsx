import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../../redux/action"; // adjust path
import type { RootState } from "../../redux/rootReducer"; // adjust path

const dietPlans = [
    {
        title: "Calisthenics Plan 🤸",
        calories: 2100,
        description:
            "High energy from complex carbs, lean protein, and healthy fats to support bodyweight training.",
        colorLight: "#f9fbe7",
        colorDark: "#37471f",
    },
    {
        title: "Muscle Building Plan 💪",
        calories: 2700,
        description:
            "Calorie surplus with high protein, moderate carbs, and healthy fats to promote muscle growth.",
        colorLight: "#ffaac6ff",
        colorDark: "#6a1b27",
    },
    {
        title: "Office Workers Plan 💼",
        calories: 1900,
        description:
            "Balanced nutrition with portion control, minimal processed snacks, and easy-to-prep healthy meals.",
        colorLight: "#b8e2feff",
        colorDark: "#223366",
    },
];

export default function DietListScreen({ navigation }: any) {
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

    return (
        <View style={[styles.screen, darkMode && styles.screenDark]}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.header, darkMode && styles.headerDark]}>
                    🍽 Diet Plans
                </Text>

                {dietPlans.map((plan, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() =>
                            navigation.navigate("DietDetailScreen", {
                                DietPlanName: plan.title,
                            })
                        }
                    >
                        <View
                            style={[
                                styles.card,
                                { backgroundColor: darkMode ? plan.colorDark : plan.colorLight },
                                darkMode && styles.cardDark,
                            ]}
                        >
                            <Text style={[styles.title, darkMode && styles.titleDark]}>
                                {plan.title}
                            </Text>
                            <View style={[styles.badge, darkMode && styles.badgeDark]}>
                                <Text style={[styles.badgeText, darkMode && styles.badgeTextDark]}>
                                    {plan.calories} kcal
                                </Text>
                            </View>
                            <Text style={[styles.description, darkMode && styles.descriptionDark]}>
                                {plan.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f0f4f8",
        padding: 20,
    },
    screenDark: {
        backgroundColor: "#121212",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#2d3436",
        textAlign: "center",
    },
    headerDark: {
        color: "#eeeeee",
    },
    scrollContainer: {
        flex: 1,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 4,
    },
    cardDark: {
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#2d3436",
    },
    titleDark: {
        color: "#f1f1f1",
    },
    badge: {
        backgroundColor: "rgba(0,0,0,0.05)",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 10,
    },
    badgeDark: {
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    badgeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2d3436",
    },
    badgeTextDark: {
        color: "#ddd",
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#2d3436",
    },
    descriptionDark: {
        color: "#cccccc",
    },
});
