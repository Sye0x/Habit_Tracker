import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BootSplash from "react-native-bootsplash";

// Screens
import GetStarted from "./components/GetStarted";
import Dashboard from "./components/Dashboard";
import UserDetailsForm from "./components/UserDetailsForm";
import TimerScreen from "./components/DashBoardItems/TimerScreen";
import DietDetailScreen from "./components/DashBoardItems/DietComponents/DietDetailScreen";
import CalorieCounterScreen from "./components/DashBoardItems/DietComponents/CalorieCounterScreen";
import SettingsScreen from "./components/DashBoardItems/ProfileComponents/Settings";
import NotificationSettingsScreen from "./components/DashBoardItems/ProfileComponents/NotificationSettingsScreen";
import AboutScreen from "./components/DashBoardItems/ProfileComponents/AboutScreen";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ForgotPassword from "./components/ForgotPassword";

// ✅ Strong typing for all routes
export type RootStackParamList = {
  GetStarted: undefined;
  Dashboard: undefined;
  UserDetailsForm: { uid: string };
  TimerScreen: undefined;
  DietDetailScreen: { DietPlanName: string };
  CalorieCounterScreen: undefined;
  SettingsScreen: undefined;
  NotificationSettingsScreen: undefined;
  AboutScreen: undefined;
  SignUp: undefined;
  LogIn: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const onReady = () => {
    BootSplash.hide({ fade: true });
  };

  return (
    <NavigationContainer onReady={onReady}>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="UserDetailsForm" component={UserDetailsForm} options={{ headerShown: false }} />
        <Stack.Screen name="TimerScreen" component={TimerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DietDetailScreen" component={DietDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalorieCounterScreen" component={CalorieCounterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
