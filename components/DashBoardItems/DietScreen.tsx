import FontAwesome from "@react-native-vector-icons/fontawesome";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

const dietPlans = [
    {
        title: "Calisthenics Plan 🤸",
        calories: 2100,
        description: "High energy from complex carbs, lean protein, and healthy fats to support bodyweight training.",
        color: "#f9fbe7",
    },
    {
        title: "Muscle Building Plan 💪",
        calories: 2700,
        description: "Calorie surplus with high protein, moderate carbs, and healthy fats to promote muscle growth.",
        color: "#ffaac6ff",
    },
    {
        title: "Office Workers Plan 💼",
        calories: 1900,
        description: "Balanced nutrition with portion control, minimal processed snacks, and easy-to-prep healthy meals.",
        color: "#b8e2feff",
    },
];

export default function DietListScreen({ navigation }: any) {
    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.header}>🍽 Diet Plans</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("CalorieCounterScreen")}>
                        <FontAwesome name="calculator" size={22} color="#555" style={{ paddingBottom: 21 }} />
                    </TouchableOpacity>

                </View>

                {dietPlans.map((plan, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("DietDetailScreen",
                            { DietPlanName: plan.title })}
                    >
                        <View style={[styles.card, { backgroundColor: plan.color }]}>
                            <Text style={styles.title}>{plan.title}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{plan.calories} kcal</Text>
                            </View>
                            <Text style={styles.description}>{plan.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f0f4f8", padding: 20 },
    header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#2d3436", textAlign: "center" },
    scrollContainer: { flex: 1 },
    card: { borderRadius: 20, padding: 20, marginBottom: 25, elevation: 4 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    badge: { backgroundColor: "rgba(0,0,0,0.05)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginBottom: 10 },
    badgeText: { fontSize: 14, fontWeight: "600" },
    description: { fontSize: 14, lineHeight: 20 },
});
