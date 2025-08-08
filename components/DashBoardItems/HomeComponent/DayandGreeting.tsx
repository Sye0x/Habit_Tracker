
import { StyleSheet, View, Text, Pressable, } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';


type Day = { date: number; status: string; day: number };

function DayandGreeting() {

    const [name, setName] = useState<string>("");


    const [week, setWeek] = useState<Day[]>([]);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentDay = today.getDay();

    const flatListRef = useRef<FlatList>(null);
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const Months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getUserData = async () => {
        const usersName = await AsyncStorage.getItem("name");
        setName(usersName ?? "");
    };

    const getDays = () => {
        const dateOfWeek: Day[] = [];
        const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < 7; i++) {
            let status = "", date = 0;
            const diff = i - currentDay;

            if (diff < 0) {
                status = "Past";
                date = currentDate + diff;
                if (date < 1) date = lastDayOfPrevMonth + date;
            } else if (diff === 0) {
                status = "Today";
                date = currentDate;
            } else {
                status = "Future";
                date = currentDate + diff;
                if (date > lastDayOfCurrentMonth) date = date - lastDayOfCurrentMonth;
            }

            dateOfWeek.push({ date, status, day: i });
        }

        setWeek(dateOfWeek);

        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: currentDay, animated: true });
        }, 100);
    };

    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Past": return { backgroundColor: "#b7efb2" };
            case "Future": return { backgroundColor: "#e0e0e0" };
            default: return { backgroundColor: "#000000ff" };
        }
    };

    const getStatusText = (status: string) => status === "Today" ? { color: "#fff" } : {};

    useEffect(() => {
        getUserData();
        getDays();

    }, []);

    useEffect(() => {
        setSelectedDayIndex(null);
    }, [week]);

    return (
        <View>
            <Text style={styles.greeting}>Good Morning {name}</Text>
            <Text style={{ fontSize: 22, marginBottom: 10, marginLeft: 10 }}>
                {currentDate}, {Months[currentMonth]}
            </Text>

            <View style={{ height: 70, marginBottom: 10 }}>
                <FlatList
                    data={week}
                    ref={flatListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const isSelected = selectedDayIndex === index;
                        return (
                            <Pressable
                                style={[
                                    styles.dayBox,
                                    getStatusColor(item.status),
                                    isSelected && { backgroundColor: "#ff924e" }
                                ]}
                                onPress={() => setSelectedDayIndex(index)}
                            >
                                <Text style={[
                                    { fontSize: 18, fontWeight: 'bold' },
                                    getStatusText(item.status),
                                    isSelected && { color: "#fff" }
                                ]}>
                                    {item.date}
                                </Text>
                                <Text style={[
                                    { fontSize: 18, fontWeight: 'bold' },
                                    getStatusText(item.status),
                                    isSelected && { color: "#fff" }
                                ]}>
                                    {weekDay[item.day]}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    dayBox: {
        width: 60,
        height: 65,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        marginRight: 5,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
        marginLeft: 10
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#222",
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 16,
        color: "#444",
        lineHeight: 22,
    },



});


export default DayandGreeting;


