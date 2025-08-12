import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DietScreenPlans from "./DietComponents/DietScreen";
import CalorieCounter from "./DietComponents/CalorieCounterScreen";
import DietHistory from "./DietComponents/DietHistory";
import { View, StyleSheet } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { toggletheme } from "../redux/action"; // adjust path if needed
import type { RootState } from "../redux/rootReducer"; // adjust path if needed
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

export default function DietScreen() {
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

    const styles = getStyles(darkMode);

    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: darkMode ? "#121212" : "#ffffff",
                        elevation: 4,
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        shadowOffset: { width: 0, height: 2 },
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        color: darkMode ? "#e0e0e0" : undefined,
                    },
                    tabBarActiveTintColor: "#3B82F6",
                    tabBarInactiveTintColor: darkMode ? "#9CA3AF" : "#6B7280",
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

const getStyles = (darkMode: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkMode ? "#121212" : "#F3F4F6",
        },
    });
