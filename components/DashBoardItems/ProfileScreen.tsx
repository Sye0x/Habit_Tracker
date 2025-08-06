import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    TextInput,
    Button,
} from 'react-native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Profile {
    name: string;
    age: string;
    occupation: string;
    gender: string;
    frequency: string;
    description: string;
    followers: string;
    friends: string;
    lastUpdated: string;
}

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        age: '',
        occupation: '',
        gender: '',
        frequency: '',
        description: '',
        followers: '0',
        friends: '0',
        lastUpdated: '',
    });

    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<Profile>({ ...profile });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const name = await AsyncStorage.getItem('name') || '';
                const age = await AsyncStorage.getItem('age') || '';
                const occupation = await AsyncStorage.getItem('occupation') || '';
                const gender = await AsyncStorage.getItem('gender') || '';
                const frequency = await AsyncStorage.getItem('frequency') || '';
                const description = await AsyncStorage.getItem('description') || '';
                const followers = await AsyncStorage.getItem('followers') || '0';
                const friends = await AsyncStorage.getItem('friends') || '0';
                const lastUpdated = await AsyncStorage.getItem('lastUpdated') || '';

                const loadedProfile: Profile = {
                    name, age, occupation, gender, frequency,
                    description, followers, friends, lastUpdated
                };

                setProfile(loadedProfile);
                setEditProfile(loadedProfile);
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        const updatedProfile: Profile = {
            ...editProfile,
            lastUpdated: new Date().toLocaleDateString()
        };
        setProfile(updatedProfile);
        setEditVisible(false);

        try {
            await AsyncStorage.setItem('name', updatedProfile.name);
            await AsyncStorage.setItem('age', updatedProfile.age);
            await AsyncStorage.setItem('occupation', updatedProfile.occupation);
            await AsyncStorage.setItem('gender', updatedProfile.gender);
            await AsyncStorage.setItem('frequency', updatedProfile.frequency);
            await AsyncStorage.setItem('description', updatedProfile.description);
            await AsyncStorage.setItem('lastUpdated', updatedProfile.lastUpdated);
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/greenbg.jpg')} style={styles.imagebg}>
                <TouchableOpacity style={styles.optionsButton} onPress={() => setEditVisible(true)}>
                    <FontAwesome name="pencil" color={'#000'} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionsButton}>
                    <FontAwesome name="cog" color={'#000'} size={24} />
                </TouchableOpacity>
            </ImageBackground>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20 }}>
                <Image source={require('../../assets/images/avatar.jpg')} style={styles.profilepic} />
                <TouchableOpacity style={styles.addFriendsButton}>
                    <Text style={{ color: '#ff924eff', fontWeight: 'bold' }}>+ Friends</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.headerRow}>
                <Text style={[styles.name, { flex: 1 }]}>{profile.name}</Text>

                <View style={styles.statBox}>
                    <Text style={styles.statCount}>{profile.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statCount}>{profile.friends}</Text>
                    <Text style={styles.statLabel}>Friends</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Profile Details</Text>

                    <View style={styles.infoRow}>
                        <FontAwesome name="birthday-cake" size={20} color="#636e72" style={styles.icon} />
                        <Text style={styles.label}>Age</Text>
                        <Text style={styles.value}>{profile.age}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <FontAwesome name="venus-mars" size={20} color="#636e72" style={styles.icon} />
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.value}>{profile.gender}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <FontAwesome name="briefcase" size={20} color="#636e72" style={styles.icon} />
                        <Text style={styles.label}>Occupation</Text>
                        <Text style={styles.value}>{profile.occupation}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <FontAwesome name="clock-o" size={20} color="#636e72" style={styles.icon} />
                        <Text style={styles.label}>Habit{`\n`}Frequency</Text>
                        <Text style={styles.value}>{profile.frequency}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                        <FontAwesome name="info-circle" size={20} color="#636e72" style={styles.icon} />
                        <Text style={styles.label}>Description</Text>
                        <Text style={[styles.value, { flex: 1 }]}>{profile.description}</Text>
                    </View>
                </View>

                <View style={styles.badgeContainer}>
                    <Text style={styles.badge}>#EarlyBird</Text>
                    <Text style={styles.badge}>#Learner</Text>
                    <Text style={styles.badge}>#Kind</Text>
                    <Text style={styles.badge}>#GoalOriented</Text>
                </View>

                {profile.lastUpdated ? (
                    <Text style={styles.lastUpdated}>Last updated: {profile.lastUpdated}</Text>
                ) : null}
            </ScrollView>

            <Modal visible={editVisible} animationType="slide">
                <ScrollView style={{ padding: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Edit Profile</Text>
                    {(['name', 'age', 'gender', 'occupation', 'frequency', 'description'] as (keyof Profile)[]).map(key => (
                        <TextInput
                            key={key}
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={editProfile[key]}
                            onChangeText={text => setEditProfile(prev => ({ ...prev, [key]: text }))}
                        />
                    ))}
                    <Button title="Save" onPress={handleSave} />
                    <Button title="Cancel" color="red" onPress={() => setEditVisible(false)} />
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 80
    },
    imagebg: {
        height: 180,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 20,
    },
    optionsButton: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 10,
    },
    profilepic: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
        marginTop: -60,
        marginLeft: 20,
    },
    addFriendsButton: {
        borderColor: '#ff924eff',
        borderWidth: 2,
        height: 40,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 10,
    },
    statBox: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    statCount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    statLabel: {
        fontSize: 12,
        color: '#636e72',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2d3436',
    },
    content: {
        padding: 20,
        paddingTop: 10,
    },
    infoCard: {
        backgroundColor: '#95e0f0ff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3436',
        marginBottom: 10,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 10,
        width: 24,
    },
    label: {
        fontSize: 15,
        color: '#000000ff',
        width: 110,
    },
    value: {
        fontSize: 15,
        color: '#34495e',
        flexShrink: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#dfe6e9',
        marginVertical: 8,
        marginLeft: 34,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        justifyContent: 'center',
    },
    badge: {
        backgroundColor: '#dfe6e9',
        color: '#2d3436',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        margin: 4,
        fontSize: 12,
        fontWeight: '500',
    },
    lastUpdated: {
        textAlign: 'center',
        color: '#636e72',
        fontSize: 12,
        marginTop: 20,
    },
});

export default ProfileScreen;
