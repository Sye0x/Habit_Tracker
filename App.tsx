import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import BootSplash from "react-native-bootsplash";

import GetStarted from "./components/GetStarted";
import Dashboard from "./components/Dashboard";
import UserDetailsForm from "./components/UserDetailsForm";
import TimerScreen from "./components/DashBoardItems/TimerScreen";
import DietDetailScreen from "./components/DashBoardItems/DietComponents/DietDetailScreen";
import CalorieCounterScreen from "./components/DashBoardItems/DietComponents/CalorieCounterScreen";
import SettingsScreen from "./components/DashBoardItems/ProfileComponents/Settings";
import NotificationSettingsScreen from "./components/DashBoardItems/ProfileComponents/NotificationSettingsScreen";
import AboutScreen from "./components/DashBoardItems/ProfileComponents/AboutScreen";

// ✅ Strong typing for all routes
export type RootStackParamList = {
  GetStarted: undefined;
  Dashboard: undefined;
  UserDetailsForm: undefined;
  TimerScreen: undefined;
  DietDetailScreen: { DietPlanName: string };
  CalorieCounterScreen: undefined;
  SettingsScreen: undefined;
  NotificationSettingsScreen: undefined;
  AboutScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const storedName = await AsyncStorage.getItem("name");
        setInitialRoute(storedName ? "Dashboard" : "GetStarted");
      } catch (e) {
        console.log("AsyncStorage error:", e);
        setInitialRoute("GetStarted");
      }
    };

    init();
  }, []);

  // Hide splash after navigation container is mounted
  const onReady = () => {
    BootSplash.hide({ fade: true });
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#c1ff72" }}>
        <ActivityIndicator size="large" color="#77a366ff" />
      </View>
    );
  }



  if (!initialRoute) {
    // While deciding route -> show loader
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#c1ff72" }}>
        <View style={{ transform: [{ scale: 3 }] }}>
          <ActivityIndicator size="large" color="#77a366ff" />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer onReady={onReady} >
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="UserDetailsForm" component={UserDetailsForm} options={{ headerShown: false }} />
        <Stack.Screen name="TimerScreen" component={TimerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DietDetailScreen" component={DietDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalorieCounterScreen" component={CalorieCounterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
