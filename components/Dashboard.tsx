import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { toggletheme } from "./redux/action";  // adjust path
import type { RootState } from "./redux/rootReducer"; // adjust path

import HomeScreen from './DashBoardItems/HomeScreen';
import ProfileScreen from './DashBoardItems/ProfileScreen';
import StatsScreen from './DashBoardItems/StatsScreen';
import DietScreen from './DashBoardItems/DietScreens';

const Tab = createBottomTabNavigator();

const lightTheme = {
    background: "#abd1a3ff",
    tabBarBackground: "#abd1a3ff",
    headerBackground: "#abd1a3ff",
    headerText: "#000",
    tabBarActive: "#ff9595ff",
    tabBarInactive: "gray",
};

const darkTheme = {
    background: "#333",
    tabBarBackground: "#333",
    headerBackground: "#222",
    headerText: "#fff",
    tabBarActive: "#ffb84d",
    tabBarInactive: "#cccccc",
};

export default function Dashboard() {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme); // get live redux value

    // Load saved theme from AsyncStorage when Dashboard mounts
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

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName: React.ComponentProps<typeof FontAwesome>['name'] = 'home';

                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Profile') iconName = 'user';
                    else if (route.name === 'Stats') iconName = 'check-square-o';
                    else if (route.name === 'Diet') iconName = 'cutlery';

                    return <FontAwesome name={iconName} size={24} color={color} />;
                },
                tabBarActiveTintColor: theme.tabBarActive,
                tabBarInactiveTintColor: theme.tabBarInactive,
                headerShown: true,
                headerStyle: { backgroundColor: theme.headerBackground },
                headerTitleStyle: { color: theme.headerText },
                tabBarHideOnKeyboard: false,
                tabBarStyle: {
                    elevation: 5,
                    backgroundColor: theme.tabBarBackground,
                    height: 55,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6.27,
                },
                tabBarLabelStyle: { fontSize: 12 },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Diet" component={DietScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}
