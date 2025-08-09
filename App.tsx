import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import GetStarted from './components/GetStarted';
import Dashboard from './components/Dashboard';
import UserDetailsForm from './components/UserDetailsForm';
import TimerScreen from './components/DashBoardItems/TimerScreen';
import DietDetailScreen from './components/DashBoardItems/DietComponents/DietDetailScreen';
import CalorieCounterScreen from './components/DashBoardItems/DietComponents/CalorieCounterScreen';

export type RootStackParamList = {
  GetStarted: undefined;
  Dashboard: undefined;
  UserDetailsForm: undefined;
  TimerScreen: undefined;
  DietListScreen: undefined;
  DietDetailScreen: { DietPlanName: string };
  CalorieCounterScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="UserDetailsForm" component={UserDetailsForm} options={{ headerShown: false }} />
        <Stack.Screen name="TimerScreen" component={TimerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DietDetailScreen" component={DietDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CalorieCounterScreen" component={CalorieCounterScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
