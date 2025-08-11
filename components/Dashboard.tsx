import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import HomeScreen from './DashBoardItems/HomeScreen';
import ProfileScreen from './DashBoardItems/ProfileScreen';
import StatsScreen from './DashBoardItems/StatsScreen';
import dietScreen from './DashBoardItems/DietScreens';
const Tab = createBottomTabNavigator();

function Dashboard() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName: React.ComponentProps<typeof FontAwesome>['name'] = 'home';

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Profile') {
                        iconName = 'user';
                    } else if (route.name === 'Stats') {
                        iconName = 'check-square-o';
                    } else if (route.name === 'Diet') {
                        iconName = 'cutlery';
                    }

                    return <FontAwesome name={iconName} size={24} color={color} />;
                },
                tabBarActiveTintColor: '#ff9595ff',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,

                // 👇 This is the new prop
                tabBarHideOnKeyboard: false,

                tabBarStyle: {
                    elevation: 5,
                    backgroundColor: '#abd1a3ff',
                    height: 55,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 6.27,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Diet" component={dietScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>

    );
}



export default Dashboard;