// StatsScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type CardDetail = {
    title: string;
    description: string;
    habitType: string;
    duration: string;
    frequency: string;
    completed?: boolean;
};

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => {
    return (
        <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
        </View>
    );
};

const StatCard = ({ label, completed, total, color }: any) => {
    const percentage = total > 0 ? completed / total : 0;

    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>
                {completed} / {total}
            </Text>
            <ProgressBar progress={percentage} color={color} />
            <Text style={styles.percentage}>{Math.round(percentage * 100)}% completed</Text>
        </View>
    );
};

const StatsScreen = () => {
    const [dailyCompleted, setDailyCompleted] = useState(0);
    const [dailyTotal, setDailyTotal] = useState(0);

    const [weeklyCompleted, setWeeklyCompleted] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);

    const [monthlyCompleted, setMonthlyCompleted] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);

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

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Completion Stats</Text>

            <StatCard label="Daily Habits" completed={dailyCompleted} total={dailyTotal} color="#4CAF50" />
            <StatCard label="Weekly Habits" completed={weeklyCompleted} total={weeklyTotal} color="#2196F3" />
            <StatCard label="Monthly Habits" completed={monthlyCompleted} total={monthlyTotal} color="#FF9800" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FAFAFA',
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
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
        color: '#444',
        marginBottom: 6,
    },
    value: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 6,
    },
    progressBackground: {
        height: 10,
        backgroundColor: '#E0E0E0',
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
        color: '#666',
    },
});

export default StatsScreen;
