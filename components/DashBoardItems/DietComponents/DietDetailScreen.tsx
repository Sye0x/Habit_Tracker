import FontAwesome from "@react-native-vector-icons/fontawesome";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

type MealPlan = {
    calories: number;
    description: string;
    meals: {
        Breakfast: string[];
        Lunch: string[];
        Dinner: string[];
        Snacks: string[];
    };
};

const dietDetails: Record<string, MealPlan> = {
    "Calisthenics Plan 🤸": {
        calories: 2100,
        description:
            "High energy from complex carbs, lean protein, and healthy fats to support bodyweight training.",
        meals: {
            Breakfast: [
                "Oatmeal with banana, chia seeds, and almond butter",
                "3 boiled eggs with whole grain toast",
                "Smoothie with spinach, berries, protein powder, and oats",
            ],
            Lunch: [
                "Grilled chicken breast, quinoa, and roasted vegetables",
                "Tuna wrap with spinach, avocado, and whole wheat tortilla",
                "Turkey and brown rice bowl with broccoli",
            ],
            Dinner: [
                "Baked salmon with sweet potato mash and asparagus",
                "Lean beef stir fry with brown rice",
                "Grilled tofu with mixed veggie salad",
            ],
            Snacks: [
                "Greek yogurt with honey and walnuts",
                "Apple slices with peanut butter",
                "Hummus with carrot sticks",
            ],
        },
    },
    "Muscle Building Plan 💪": {
        calories: 2700,
        description:
            "Calorie surplus with high protein, moderate carbs, and healthy fats to promote muscle growth.",
        meals: {
            Breakfast: [
                "4 scrambled eggs with whole grain toast and avocado",
                "Protein pancakes with blueberries",
                "Omelette with spinach, cheese, and turkey",
            ],
            Lunch: [
                "Chicken breast with brown rice and green beans",
                "Ground beef burrito with whole wheat tortilla",
                "Salmon salad with quinoa and olive oil dressing",
            ],
            Dinner: [
                "Steak with mashed potatoes and steamed broccoli",
                "Baked cod with couscous and roasted zucchini",
                "Chicken pasta with marinara sauce",
            ],
            Snacks: [
                "Cottage cheese with pineapple",
                "Mixed nuts and dried fruit",
                "Protein shake with banana",
            ],
        },
    },
    "Office Workers Plan 💼": {
        calories: 1900,
        description:
            "Balanced nutrition with portion control, minimal processed snacks, and easy-to-prep healthy meals.",
        meals: {
            Breakfast: [
                "Overnight oats with chia seeds and berries",
                "Whole wheat toast with avocado and boiled egg",
                "Low-fat yogurt with granola",
            ],
            Lunch: [
                "Grilled chicken salad with olive oil dressing",
                "Whole wheat pasta with veggies and light tomato sauce",
                "Turkey sandwich with lettuce and tomato",
            ],
            Dinner: [
                "Baked salmon with steamed broccoli",
                "Vegetable stir fry with tofu",
                "Lean chicken with sweet potato",
            ],
            Snacks: [
                "Handful of almonds",
                "Apple with peanut butter",
                "Carrot sticks with hummus",
            ],
        },
    },
};


type DietDetailProps = {
    route: { params: { DietPlanName: string } };
    navigation: any;
};

// Pastel colors matching the DietListScreen
const planColors: Record<string, string> = {
    "Calisthenics Plan 🤸": "#f9fbe7",
    "Muscle Building Plan 💪": "#ffaac6ff",
    "Office Workers Plan 💼": "#b8e2feff",
};

export default function DietDetailScreen({ route, navigation }: DietDetailProps) {
    const { DietPlanName } = route.params;
    const plan = dietDetails[DietPlanName];

    if (!plan) {
        return (
            <View style={styles.screen}>
                <Text style={styles.errorText}>Plan not found.</Text>
            </View>
        );
    }

    const mealIcons: Record<keyof MealPlan["meals"], "coffee" | "cutlery" | "spoon" | "apple"> = {
        Breakfast: "coffee",
        Lunch: "cutlery",
        Dinner: "spoon",
        Snacks: "apple",
    };

    const themeColor = planColors[DietPlanName] || "#f8fafc";

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: themeColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={22} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{DietPlanName}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Calories & Description */}
                <View style={[styles.infoCard, { backgroundColor: themeColor }]}>
                    <Text style={styles.calories}>🔥 {plan.calories} Calories</Text>
                    <Text style={styles.description}>{plan.description}</Text>
                </View>

                {/* Meals */}
                {Object.entries(plan.meals).map(([mealType, items]) => (
                    <View key={mealType} style={[styles.mealCard, { backgroundColor: themeColor }]}>
                        <View style={styles.mealHeader}>
                            <FontAwesome name={mealIcons[mealType as keyof typeof mealIcons]} size={18} color="#333" />
                            <Text style={styles.mealTitle}>{mealType}</Text>
                        </View>
                        {items.map((item, index) => (
                            <Text key={index} style={styles.mealItem}>• {item}</Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f0f4f8" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 3,
    },
    backButton: {
        backgroundColor: "rgba(0,0,0,0.05)",
        padding: 6,
        borderRadius: 8,
        marginRight: 12,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333", flexShrink: 1 },

    infoCard: {
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        marginBottom: 16,
    },
    calories: { fontSize: 18, fontWeight: "bold", marginBottom: 6, color: "#E53935" },
    description: { fontSize: 14, color: "#333" },

    mealCard: {
        padding: 14,
        borderRadius: 12,
        elevation: 1,
        marginBottom: 14,
    },
    mealHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    mealTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 8, color: "#333" },
    mealItem: { fontSize: 14, marginLeft: 8, color: "#444" },

    errorText: { fontSize: 16, textAlign: "center", marginTop: 50 },
});
