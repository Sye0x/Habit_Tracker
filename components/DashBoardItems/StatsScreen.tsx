import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { toggletheme } from '../redux/action'; // adjust path if needed
import type { RootState } from '../redux/rootReducer'; // adjust path if needed

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string;
    frequency: string;
    completed?: boolean;
};

const lightTheme = {
    background: '#f0f4f8',
    cardBackground: '#fff',
    text: '#222',
    subText: '#666',
    track: '#E0E0E0',
};

const darkTheme = {
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#f0f0f0',
    subText: '#ccc',
    track: '#333',
};

const ProgressBar = ({ progress, color, trackColor }: { progress: number; color: string; trackColor: string }) => (
    <View style={[styles.progressBackground, { backgroundColor: trackColor }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
);

const StatCard = ({ label, completed, total, color, textColor, backgroundColor, trackColor }: any) => {
    const percentage = total > 0 ? completed / total : 0;

    return (
        <View style={[styles.card, { borderLeftColor: color, backgroundColor }]}>
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            <Text style={[styles.value, { color: textColor }]}>
                {completed} / {total}
            </Text>
            <ProgressBar progress={percentage} color={color} trackColor={trackColor} />
            <Text style={[styles.percentage, { color: textColor }]}>{Math.round(percentage * 100)}% completed</Text>
        </View>
    );
};

const StatsScreen = () => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme);
    const theme = darkMode ? darkTheme : lightTheme;

    const [dailyCompleted, setDailyCompleted] = useState(0);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [weeklyCompleted, setWeeklyCompleted] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyCompleted, setMonthlyCompleted] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);

    // Sync theme and load/reset habits on mount
    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem('colorMode');
            if (savedTheme !== null) {
                const parsedTheme = JSON.parse(savedTheme);
                if (parsedTheme !== darkMode) {
                    dispatch(toggletheme(parsedTheme));
                }
            }
            await loadStats();
            await resetHabitsIfNeeded();
        })();
    }, []);

    const loadStats = async () => {
        const stored = await AsyncStorage.getItem('customCards');
        if (stored) {
            const cards: CardDetail[] = JSON.parse(stored);

            const dailyCards = cards.filter(card => card.frequency === 'Daily');
            const weeklyCards = cards.filter(card => card.frequency === 'Weekly');
            const monthlyCards = cards.filter(card => card.frequency === 'Monthly');

            setDailyTotal(dailyCards.length);
            setWeeklyTotal(weeklyCards.length);
            setMonthlyTotal(monthlyCards.length);

            setDailyCompleted(dailyCards.filter(card => card.completed).length);
            setWeeklyCompleted(weeklyCards.filter(card => card.completed).length);
            setMonthlyCompleted(monthlyCards.filter(card => card.completed).length);
        }
    };

    const resetHabitsIfNeeded = async () => {
        const stored = await AsyncStorage.getItem('customCards');
        if (!stored) return;
        let cards: CardDetail[] = JSON.parse(stored);

        const lastResetStr = await AsyncStorage.getItem('lastResetDates');
        let lastReset = lastResetStr ? JSON.parse(lastResetStr) : { daily: null, weekly: null, monthly: null };
        const today = new Date();

        const todayStr = today.toISOString().split('T')[0];
        if (lastReset.daily !== todayStr) {
            cards = cards.map(c => (c.frequency === 'Daily' ? { ...c, completed: false } : c));
            lastReset.daily = todayStr;
        }

        const getWeekString = (d: Date) => {
            const year = d.getFullYear();
            const firstJan = new Date(year, 0, 1);
            const days = Math.floor((d.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000));
            const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
            return `${year}-W${week}`;
        };
        const currentWeek = getWeekString(today);
        if (lastReset.weekly !== currentWeek) {
            cards = cards.map(c => (c.frequency === 'Weekly' ? { ...c, completed: false } : c));
            lastReset.weekly = currentWeek;
        }

        const currentMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;
        if (lastReset.monthly !== currentMonth) {
            cards = cards.map(c => (c.frequency === 'Monthly' ? { ...c, completed: false } : c));
            lastReset.monthly = currentMonth;
        }

        await AsyncStorage.setItem('customCards', JSON.stringify(cards));
        await AsyncStorage.setItem('lastResetDates', JSON.stringify(lastReset));
        // Reload stats after reset
        await loadStats();
    };

    // Refresh stats when screen is focused (e.g. after navigating back)
    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Your Completion Stats</Text>

            <StatCard
                label="Daily Habits"
                completed={dailyCompleted}
                total={dailyTotal}
                color="#4CAF50"
                textColor={theme.text}
                backgroundColor={theme.cardBackground}
                trackColor={theme.track}
            />
            <StatCard
                label="Weekly Habits"
                completed={weeklyCompleted}
                total={weeklyTotal}
                color="#2196F3"
                textColor={theme.text}
                backgroundColor={theme.cardBackground}
                trackColor={theme.track}
            />
            <StatCard
                label="Monthly Habits"
                completed={monthlyCompleted}
                total={monthlyTotal}
                color="#FF9800"
                textColor={theme.text}
                backgroundColor={theme.cardBackground}
                trackColor={theme.track}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    progressBackground: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    percentage: {
        marginTop: 5,
        fontSize: 14,
    },
});

export default StatsScreen;
