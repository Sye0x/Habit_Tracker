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
    Alert,
} from 'react-native';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

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
    photoUri?: string;  // add photoUri to store image path
}

function ProfileScreen({ navigation }: { navigation: any }) {
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
        photoUri: undefined,
    });

    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [editProfile, setEditProfile] = useState<Profile>({ ...profile });
    const [showFrequencyList, setShowFrequencyList] = useState<boolean>(false);

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
                const photoUri = await AsyncStorage.getItem('photoUri') || undefined;

                const loadedProfile: Profile = {
                    name, age, occupation, gender, frequency,
                    description, followers, friends, lastUpdated, photoUri
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
            if (updatedProfile.photoUri) {
                await AsyncStorage.setItem('photoUri', updatedProfile.photoUri);
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    };

    // Image picker function
    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.7,
            },
            (response) => {
                if (response.didCancel) {
                    // user cancelled
                } else if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage || 'Error picking image');
                } else if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    if (uri) {
                        setEditProfile(prev => ({ ...prev, photoUri: uri }));
                    }
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/greenbg.jpg')} style={styles.imagebg}>
                <TouchableOpacity style={styles.optionsButton} onPress={() => setEditVisible(true)}>
                    <FontAwesome name="pencil" color={'#000'} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionsButton} onPress={() => navigation.navigate("SettingsScreen")}>
                    <FontAwesome name="cog" color={'#000'} size={24} />
                </TouchableOpacity>
            </ImageBackground>

            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingRight: 20 }}>
                <TouchableOpacity onPress={pickImage}>
                    {profile.photoUri ? (
                        <Image source={{ uri: profile.photoUri }} style={styles.profilepic} />
                    ) : (
                        <Image source={require('../../assets/images/avatar.jpg')} style={styles.profilepic} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Profile Details</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Age</Text>
                        <Text style={styles.value}>{profile.age}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.value}>{profile.gender}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Occupation</Text>
                        <Text style={styles.value}>{profile.occupation}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Habit Frequency</Text>
                        <Text style={styles.value}>{profile.frequency}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
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

            {/* Edit modal unchanged except adding image picker on profile pic */}
            <Modal visible={editVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Profile Image Picker */}
                            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 20 }}>
                                {editProfile.photoUri ? (
                                    <Image source={{ uri: editProfile.photoUri }} style={styles.profilepic} />
                                ) : (
                                    <Image source={require('../../assets/images/avatar.jpg')} style={styles.profilepic} />
                                )}
                                <Text style={{ textAlign: 'center', color: '#27ae60', marginTop: 8 }}>
                                    Tap to change photo
                                </Text>
                            </TouchableOpacity>

                            {/* Name */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Name</Text>
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="Enter Name"
                                    value={editProfile.name}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, name: text }))}
                                />
                            </View>

                            {/* Age */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Age</Text>
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="Enter Age"
                                    keyboardType="numeric"
                                    value={editProfile.age}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, age: text }))}
                                />
                            </View>

                            {/* Gender */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <View style={styles.radioContainer}>
                                    {['Male', 'Female'].map(option => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.radioOption}
                                            onPress={() => setEditProfile(prev => ({ ...prev, gender: option }))}
                                        >
                                            <View style={[styles.radioOuter, editProfile.gender === option && styles.radioOuterSelected]}>
                                                {editProfile.gender === option && <View style={styles.radioInner} />}
                                            </View>
                                            <Text style={styles.radioLabel}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Occupation */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Occupation</Text>
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="Enter Occupation"
                                    value={editProfile.occupation}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, occupation: text }))}
                                />
                            </View>

                            {/* Habit Frequency */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Habit Frequency</Text>
                                <TouchableOpacity
                                    style={styles.dropdown}
                                    onPress={() => setShowFrequencyList(!showFrequencyList)}
                                >
                                    <Text style={{ color: editProfile.frequency ? '#000' : '#888' }}>
                                        {editProfile.frequency || 'Select Frequency'}
                                    </Text>
                                </TouchableOpacity>

                                {showFrequencyList && (
                                    <View style={styles.dropdownList}>
                                        {['Daily', '2-3 Days a week', '4-5 Days a week'].map(option => (
                                            <TouchableOpacity
                                                key={option}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setEditProfile(prev => ({ ...prev, frequency: option }));
                                                    setShowFrequencyList(false);
                                                }}
                                            >
                                                <Text>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Description */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Description</Text>
                                <TextInput
                                    style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
                                    placeholder="Enter Description"
                                    multiline
                                    value={editProfile.description}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, description: text }))}
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f8",
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
        borderColor: "#f0f4f8",
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2d3436',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: '#636e72',
        marginBottom: 5,
        fontWeight: '500',
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 10,
        padding: 10,
        fontSize: 15,
        backgroundColor: '#f9f9f9',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
    },
    cancelText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 5,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioOuterSelected: {
        borderColor: '#27ae60',
    },
    radioInner: {
        height: 10,
        width: 10,
        backgroundColor: '#27ae60',
        borderRadius: 5,
    },
    radioLabel: {
        fontSize: 15,
        color: '#333',
    },

    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    dropdownList: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },



});

export default ProfileScreen;
