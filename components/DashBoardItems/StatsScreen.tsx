import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
    Share,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-native-paper';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function StatsScreen() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [view, setView] = useState<'thisWeek' | 'lastWeek'>('thisWeek');
    const quotes = [
        'Keep pushing forward!',
        'Every day is a new chance.',
        'Progress, not perfection.',
        'Small consistent actions lead to big results.',
        'Your streak is your power!',
    ];
    const [quote, setQuote] = useState<string>('');

    useEffect(() => {
        // Pick a random quote on mount
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    const toggleExpand = (section: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => (prev === section ? null : section));
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Here’s my ${view === 'thisWeek' ? 'this week' : 'last week'} progress! 🔥 Keep it up!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Dummy data change based on view toggle
    const data = {
        daily: view === 'thisWeek'
            ? { tasks: 3, focus: '1h 20m', streak: 3, best: 10, progress: 0.6 }
            : { tasks: 2, focus: '1h 05m', streak: 1, best: 10, progress: 0.4 },
        weekly: view === 'thisWeek'
            ? { tasks: 18, completion: 0.85, streak: 5 }
            : { tasks: 12, completion: 0.7, streak: 2 },
        monthly: view === 'thisWeek'
            ? { tasks: 72, goals: '4 / 5', growth: '+12%', progress: 0.8 }
            : { tasks: 50, goals: '3 / 5', growth: '+8%', progress: 0.6 },
        achievement: ['Consistency Champ', '5-day streak reward'],
        motivation: quote,
        streakCount: view === 'thisWeek' ? 5 : 2,
    };


    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }}>
            <Text style={styles.header}>📊 Your Progress</Text>

            {/* Summary Box */}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>🧠 Total Focus Time: 22h 30m</Text>
                <Text style={styles.summaryText}>✅ Tasks Completed: 210</Text>
                <Text style={styles.summaryText}>🏆 Current Streak: {data.streakCount} Days</Text>
            </View>

            {/* View Toggle */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    onPress={() => setView('thisWeek')}
                    style={[styles.toggleButton, view === 'thisWeek' && styles.toggleSelected]}
                >
                    <Text style={[styles.toggleText, view === 'thisWeek' && styles.toggleTextSelected]}>
                        This Week
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setView('lastWeek')}
                    style={[styles.toggleButton, view === 'lastWeek' && styles.toggleSelected]}
                >
                    <Text style={[styles.toggleText, view === 'lastWeek' && styles.toggleTextSelected]}>
                        Last Week
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <FontAwesome name="share-alt" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* THIS WEEK VIEW (normal cards) */}
            {view === 'thisWeek' ? (
                <>
                    {/* Daily Card */}
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: '#f8c291' }]}
                        onPress={() => toggleExpand('daily')}
                    >
                        <Text style={styles.cardTitle}>📅 Daily Progress</Text>
                        {expanded === 'daily' && (
                            <>
                                <Text style={styles.cardData}>✔ Tasks: {data.daily.tasks}</Text>
                                <Text style={styles.cardData}>⏱ Focus: {data.daily.focus}</Text>
                                <Text style={styles.cardData}>🔥 Streak: {data.daily.streak} days</Text>
                                <VisualStreak count={data.daily.streak} />
                                <Text style={styles.cardData}>🏅 Best: {data.daily.best} days</Text>
                                <Text style={styles.cardData}>📈 Progress</Text>
                                <ProgressBar progress={data.daily.progress} color="#d35400" style={styles.progress} />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Weekly Card */}
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: '#82ccdd' }]}
                        onPress={() => toggleExpand('weekly')}
                    >
                        <Text style={styles.cardTitle}>🗓️ Weekly Progress</Text>
                        {expanded === 'weekly' && (
                            <>
                                <Text style={styles.cardData}>✔ Tasks: {data.weekly.tasks}</Text>
                                <Text style={styles.cardData}>
                                    📊 Completion: {Math.round(data.weekly.completion * 100)}%
                                </Text>
                                <Text style={styles.cardData}>🔥 Streak: {data.weekly.streak} days</Text>
                                <VisualStreak count={data.weekly.streak} />
                                <Text style={styles.cardData}>📈 Growth</Text>
                                <ProgressBar
                                    progress={data.weekly.completion}
                                    color="#2980b9"
                                    style={styles.progress}
                                />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Monthly Card */}
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: '#b8e994' }]}
                        onPress={() => toggleExpand('monthly')}
                    >
                        <Text style={styles.cardTitle}>📆 Monthly Progress</Text>
                        {expanded === 'monthly' && (
                            <>
                                <Text style={styles.cardData}>✔ Tasks: {data.monthly.tasks}</Text>
                                <Text style={styles.cardData}>🎯 Goals: {data.monthly.goals}</Text>
                                <Text style={styles.cardData}>📈 Growth: {data.monthly.growth}</Text>
                                <ProgressBar
                                    progress={data.monthly.progress}
                                    color="#27ae60"
                                    style={styles.progress}
                                />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Achievement */}
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: '#f6e58d' }]}
                        onPress={() => toggleExpand('achievement')}
                    >
                        <Text style={styles.cardTitle}>🎖️ Achievements</Text>
                        {expanded === 'achievement' && (
                            <>
                                {data.achievement.map((ach, i) => (
                                    <Text style={styles.cardData} key={i}>
                                        🏆 {ach}
                                    </Text>
                                ))}
                            </>
                        )}
                    </TouchableOpacity>
                </>
            ) : (
                // LAST WEEK COMBINED CARD
                // LAST WEEK - Cleaner, summarized card
                <TouchableOpacity
                    style={[styles.card, styles.lastWeekCard]}
                    onPress={() => toggleExpand('lastWeek')}
                >
                    <Text style={styles.lastWeekTitle}>📚 Last Week Summary</Text>

                    {expanded === 'lastWeek' && (
                        <View style={styles.lastWeekContent}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>🧠 Focus Time:</Text>
                                <Text style={styles.value}>{data.daily.focus}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>✔ Tasks Completed:</Text>
                                <Text style={styles.value}>
                                    {data.daily.tasks + data.weekly.tasks + data.monthly.tasks}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>🔥 Best Daily Streak:</Text>
                                <Text style={styles.value}>{data.daily.best} days</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>📊 Weekly Completion:</Text>
                                <Text style={styles.value}>
                                    {Math.round(data.weekly.completion * 100)}%
                                </Text>
                            </View>
                            <View style={styles.achievementsBox}>
                                <Text style={styles.label}>🏅 Top Achievements:</Text>
                                {data.achievement.slice(0, 2).map((ach, i) => (
                                    <Text key={i} style={styles.value}>• {ach}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

            )}

            {/* Motivation - Shown always */}
            <TouchableOpacity
                style={[styles.card, { backgroundColor: '#fab1a0' }]}
                onPress={() => toggleExpand('motivation')}
            >
                <Text style={styles.cardTitle}>💡 Motivation</Text>
                {expanded === 'motivation' && <Text style={styles.cardData}>“{data.motivation}”</Text>}
            </TouchableOpacity>
        </ScrollView>
    );

}

// Visual streak flames component
const VisualStreak = ({ count }: { count: number }) => {
    const maxFlames = 7;
    return (
        <View style={{ flexDirection: 'row', marginVertical: 6 }}>
            {[...Array(maxFlames)].map((_, i) => (
                <FontAwesome
                    key={i}
                    name="fire"
                    size={20}
                    color={i < count ? '#e17055' : '#dfe6e9'}
                    style={{ marginRight: 4 }}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        padding: 16,
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 20,
        color: '#2c3e50',
    },
    summaryBox: {
        backgroundColor: '#dff9fb',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 15,
        color: '#130f40',
        marginBottom: 4,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        alignItems: 'center',
    },
    toggleButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 8,
        backgroundColor: '#dfe6e9',
        borderRadius: 12,
        alignItems: 'center',
    },
    toggleSelected: {
        backgroundColor: '#0984e3',
    },
    toggleText: {
        fontSize: 14,
        color: '#636e72',
        fontWeight: '600',
    },
    toggleTextSelected: {
        color: '#fff',
    },
    shareButton: {
        padding: 10,
        backgroundColor: '#6c5ce7',
        borderRadius: 12,
        marginLeft: 8,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 8,
    },
    cardData: {
        fontSize: 15,
        color: '#2f3542',
        marginBottom: 6,
    },
    progress: {
        height: 8,
        borderRadius: 8,
        marginTop: 4,
    },
    lastWeekCard: {
        backgroundColor: '#ffeaa7',
        borderWidth: 1,
        borderColor: '#f6b93b',
        padding: 16,
        borderRadius: 18,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },

    lastWeekTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
        color: '#2d3436',
    },

    lastWeekContent: {
        paddingVertical: 4,
        gap: 10,
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingBottom: 4,
    },

    label: {
        fontWeight: '600',
        color: '#2d3436',
        fontSize: 15,
    },

    value: {
        fontWeight: '500',
        fontSize: 15,
        color: '#34495e',
    },

    achievementsBox: {
        marginTop: 10,
        paddingTop: 6,
    },

});

export default StatsScreen;
