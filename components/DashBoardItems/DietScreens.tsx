import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DietScreenPlans from "./DietComponents/DietScreen";
import CalorieCounter from "./DietComponents/CalorieCounterScreen";
import DietHistory from "./DietComponents/DietHistory";
import { View, StyleSheet } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function DietScreen() {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: "#ffffff",
                        elevation: 4, // Android shadow
                        shadowOpacity: 0.1, // iOS shadow
                        shadowRadius: 3,
                        shadowOffset: { width: 0, height: 2 },
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: "bold",
                        textTransform: "capitalize", // Keep first letter capital only
                    },
                    tabBarActiveTintColor: "#3B82F6", // Active tab color
                    tabBarInactiveTintColor: "#6B7280", // Inactive tab color
                    tabBarIndicatorStyle: {
                        backgroundColor: "#3B82F6",
                        height: 3,
                        borderRadius: 2,
                    },
                }}
            >
                <Tab.Screen name="Diet History" component={DietHistory} />
                <Tab.Screen name="Diet Plans" component={DietScreenPlans} />
                <Tab.Screen name="Calorie Calculator" component={CalorieCounter} />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6", // Light background behind tabs
    },
});
