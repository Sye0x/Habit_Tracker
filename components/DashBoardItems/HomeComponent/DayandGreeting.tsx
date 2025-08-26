import { StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import type { RootState } from './../../redux/rootReducer';  // Adjust the path as needed


function DayandGreeting() {
    // Get dark mode value from Redux store
    const isDark = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.userData);

    const [date, setDate] = useState<number>(0);
    const [month, setMonth] = useState<string>("");
    // Load user name from AsyncStorage
    const getUserData = async () => {
        const usersName = await AsyncStorage.getItem("name");
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const today = new Date();

        setDate(today.getDate());
        setMonth(months[today.getMonth()]);

        getUserData();
    }, []);

    return (
        <View style={[{ backgroundColor: isDark ? "#121212" : "#f0f4f8" }]}>
            <Text style={[styles.greeting, { color: isDark ? "#fff" : "#000" }]}>
                Good Morning{'\n'}{user.name}
            </Text>
            <Text style={{
                fontSize: 22,
                marginBottom: 10,
                marginLeft: 10,
                color: isDark ? "#fff" : "#000"
            }}>
                {date}, {month}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        marginLeft: 10
    },
});

export default DayandGreeting;
