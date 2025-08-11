import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import dietScreen from './DietComponents/DietScreen'
import colorieCounter from './DietComponents/CalorieCounterScreen'
import DietHistory from './DietComponents/DietHistory';
const Tab = createMaterialTopTabNavigator();

export default function DietScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Diet History" component={DietHistory} />
            <Tab.Screen name="Diet Plans" component={dietScreen} />
            <Tab.Screen name="Colorie Calculator" component={colorieCounter} />
        </Tab.Navigator>
    );
}