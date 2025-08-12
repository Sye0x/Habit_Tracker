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
import { useDispatch, useSelector } from 'react-redux';
import { toggletheme } from '../redux/action';  // Adjust import path
import type { RootState } from '../redux/rootReducer'; // Adjust import path

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
    photoUri?: string;
}

interface ProfileScreenProps {
    navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.theme);

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem("colorMode");
            if (savedTheme !== null) {
                const parsedTheme = JSON.parse(savedTheme);
                if (parsedTheme !== darkMode) {
                    dispatch(toggletheme(parsedTheme));
                }
            }
        })();
    }, []);

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

    const styles = getStyles(darkMode);

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
            } else {
                await AsyncStorage.removeItem('photoUri');
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    };

    const pickImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.7,
            },
            async (response) => {
                if (response.didCancel) {
                    // user cancelled
                } else if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage || 'Error picking image');
                } else if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    if (uri) {
                        setEditProfile(prev => ({ ...prev, photoUri: uri }));
                        setProfile(prev => ({ ...prev, photoUri: uri }));
                        try {
                            await AsyncStorage.setItem('photoUri', uri);
                        } catch (error) {
                            console.error('Failed to save photoUri:', error);
                        }
                    }
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/greenbg.jpg')}
                style={styles.imagebg}
                imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
            >
                <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: 'center' }}>
                    <TouchableOpacity style={styles.optionsButton} onPress={() => setEditVisible(true)}>
                        <FontAwesome name="pencil" color="#fff" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionsButton} onPress={() => navigation.navigate("SettingsScreen")}>
                        <FontAwesome name="cog" color="#fff" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerOverlay} />
            </ImageBackground>

            <View style={styles.profileSection}>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                    <View style={styles.profilePicWrapper}>
                        {profile.photoUri ? (
                            <Image source={{ uri: profile.photoUri }} style={styles.profilepic} />
                        ) : (
                            <Image source={require('../../assets/images/avatar.jpg')} style={styles.profilepic} />
                        )}
                        <View style={styles.cameraIconWrapper}>
                            <FontAwesome name="camera" size={20} color="#fff" />
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={styles.profileName}>{profile.name || 'Your Name'}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Profile Details</Text>

                    {[
                        { label: 'Age', value: profile.age },
                        { label: 'Gender', value: profile.gender },
                        { label: 'Occupation', value: profile.occupation },
                        { label: 'Habit Frequency', value: profile.frequency },
                    ].map((item, idx) => (
                        <View key={item.label}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{item.label}</Text>
                                <Text style={styles.value}>{item.value || '-'}</Text>
                            </View>
                            {idx !== 3 && <View style={styles.divider} />}
                        </View>
                    ))}

                    <View style={[styles.infoRow, { alignItems: 'flex-start', marginTop: 12 }]}>
                        <Text style={styles.label}>Description</Text>
                        <Text
                            style={[
                                styles.value,
                                {
                                    flex: 1,
                                    fontStyle: profile.description ? 'normal' : 'italic',
                                    color: profile.description ? styles.value.color : '#888',
                                },
                            ]}
                        >
                            {profile.description || 'No description added yet.'}
                        </Text>
                    </View>
                </View>

                <View style={styles.badgeContainer}>
                    {['#EarlyBird', '#Learner', '#Kind', '#GoalOriented'].map(tag => (
                        <View key={tag} style={styles.badge}>
                            <Text style={styles.badgeText}>{tag}</Text>
                        </View>
                    ))}
                </View>

                {profile.lastUpdated ? (
                    <Text style={styles.lastUpdated}>Last updated: {profile.lastUpdated}</Text>
                ) : null}
            </ScrollView>

            {/* Edit modal */}
            <Modal visible={editVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                            <TouchableOpacity onPress={pickImage} style={styles.modalProfilePicWrapper}>
                                {editProfile.photoUri ? (
                                    <Image source={{ uri: editProfile.photoUri }} style={styles.modalProfilePic} />
                                ) : (
                                    <Image source={require('../../assets/images/avatar.jpg')} style={styles.modalProfilePic} />
                                )}

                                <Text style={styles.photoHintText}>Tap to change photo</Text>
                            </TouchableOpacity>

                            {/* Inputs */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Name</Text>
                                <TextInput
                                    style={styles.inputField}
                                    value={editProfile.name}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, name: text }))}
                                    placeholder="Enter your name"
                                    placeholderTextColor={darkMode ? "#aaa" : "#999"}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Age</Text>
                                <TextInput
                                    style={styles.inputField}
                                    value={editProfile.age}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, age: text }))}
                                    placeholder="Enter your age"
                                    keyboardType="numeric"
                                    placeholderTextColor={darkMode ? "#aaa" : "#999"}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Occupation</Text>
                                <TextInput
                                    style={styles.inputField}
                                    value={editProfile.occupation}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, occupation: text }))}
                                    placeholder="Enter your occupation"
                                    placeholderTextColor={darkMode ? "#aaa" : "#999"}
                                />
                            </View>

                            {/* Gender radio buttons */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <View style={styles.radioContainer}>
                                    {['Male', 'Female'].map(g => (
                                        <TouchableOpacity
                                            key={g}
                                            style={styles.radioOption}
                                            onPress={() => setEditProfile(prev => ({ ...prev, gender: g }))}
                                        >
                                            <View style={[
                                                styles.radioOuter,
                                                editProfile.gender === g && styles.radioOuterSelected,
                                            ]}>
                                                {editProfile.gender === g && <View style={styles.radioInner} />}
                                            </View>
                                            <Text style={styles.radioLabel}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Frequency dropdown */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Habit Frequency</Text>
                                <TouchableOpacity
                                    style={styles.dropdown}
                                    onPress={() => setShowFrequencyList(prev => !prev)}
                                >
                                    <Text style={{ color: editProfile.frequency ? (darkMode ? '#eee' : '#2c3e50') : '#999' }}>
                                        {editProfile.frequency || 'Select frequency'}
                                    </Text>
                                </TouchableOpacity>
                                {showFrequencyList && (
                                    <View style={styles.dropdownList}>
                                        {['Daily', 'Weekly', 'Monthly', 'Occasionally'].map(freq => (
                                            <TouchableOpacity
                                                key={freq}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setEditProfile(prev => ({ ...prev, frequency: freq }));
                                                    setShowFrequencyList(false);
                                                }}
                                            >
                                                <Text style={{ color: (darkMode ? '#eee' : '#2c3e50') }}>{freq}</Text>
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
                                    value={editProfile.description}
                                    onChangeText={text => setEditProfile(prev => ({ ...prev, description: text }))}
                                    multiline
                                    placeholder="Add a description"
                                    placeholderTextColor={darkMode ? "#aaa" : "#999"}
                                />
                            </View>

                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditVisible(false)} activeOpacity={0.85}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </Modal >
        </View >
    );
};

const getStyles = (darkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: darkMode ? '#121212' : '#e8f0f7',
    },
    imagebg: {
        height: 160,
        width: '100%',
    },
    headerOverlay: {},

    optionsButton: {
        height: 44,
        width: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.4)',
        borderRadius: 14,
        marginLeft: 12,
        shadowColor: darkMode ? '#fff' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: darkMode ? 0.15 : 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    profileSection: {
        marginTop: -60,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    profilePicWrapper: {
        position: 'relative',
        shadowColor: darkMode ? '#fff' : '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: darkMode ? 0.2 : 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    profilepic: {
        height: 130,
        width: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: darkMode ? '#333' : '#fff',
    },
    cameraIconWrapper: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: '#27ae60',
        borderRadius: 16,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 6,
    },
    profileName: {
        marginTop: 12,
        fontSize: 28,
        fontWeight: 'bold',
        color: darkMode ? '#f0f0f0' : '#2c3e50',
        letterSpacing: 0.5,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 100,
    },
    infoCard: {
        backgroundColor: darkMode ? '#1e272e' : '#ffffff',
        borderRadius: 24,
        paddingVertical: 24,
        paddingHorizontal: 20,
        shadowColor: darkMode ? '#000' : '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: darkMode ? 0.3 : 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: darkMode ? '#ddd' : '#34495e',
        marginBottom: 18,
        textAlign: 'center',
        letterSpacing: 0.8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: darkMode ? '#999' : '#7f8c8d',
        fontWeight: '600',
    },
    value: {
        fontSize: 16,
        color: darkMode ? '#eee' : '#2c3e50',
        maxWidth: '70%',
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: darkMode ? '#444' : '#ecf0f1',
        marginVertical: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 24,
        gap: 12,
    },
    badge: {
        backgroundColor: '#27ae60',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 30,
        shadowColor: '#1e8449',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    lastUpdated: {
        textAlign: 'center',
        color: darkMode ? '#bbb' : '#95a5a6',
        fontSize: 13,
        marginTop: 28,
        fontStyle: 'italic',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: darkMode ? 'rgba(18,18,18,0.95)' : 'rgba(44, 62, 80, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: darkMode ? '#333' : '#fefefe',
        borderRadius: 30,
        padding: 24,
        width: '100%',
        maxHeight: '85%',
        shadowColor: darkMode ? '#000' : '#34495e',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: darkMode ? 0.7 : 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: darkMode ? '#eee' : '#2c3e50',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 1,
    },
    modalProfilePicWrapper: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalProfilePic: {
        height: 130,
        width: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: '#27ae60',
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 12,
    },
    photoHintText: {
        marginTop: 8,
        color: '#27ae60',
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: darkMode ? '#eee' : '#34495e',
        marginBottom: 6,
    },
    inputField: {
        borderWidth: 1,
        borderColor: darkMode ? '#555' : '#bdc3c7',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: darkMode ? '#444' : '#ecf0f1',
        color: darkMode ? '#eee' : '#2c3e50',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
    },
    saveButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 14,
        borderRadius: 18,
        flex: 1,
        marginRight: 12,
        shadowColor: '#229954',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    saveText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 14,
        borderRadius: 18,
        flex: 1,
        marginLeft: 12,
        shadowColor: '#c0392b',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    cancelText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
    },
    radioContainer: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 8,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: darkMode ? '#555' : '#bdc3c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioOuterSelected: {
        borderColor: '#27ae60',
    },
    radioInner: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: '#27ae60',
    },
    radioLabel: {
        fontSize: 16,
        color: darkMode ? '#eee' : '#34495e',
        fontWeight: '600',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: darkMode ? '#555' : '#bdc3c7',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: darkMode ? '#444' : '#ecf0f1',
    },
    dropdownList: {
        backgroundColor: darkMode ? '#222' : '#fff',
        borderRadius: 14,
        marginTop: 6,
        borderWidth: 1,
        borderColor: darkMode ? '#555' : '#dfe6e9',
        maxHeight: 140,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: darkMode ? '#444' : '#f0f0f0',
    },
});

export default ProfileScreen;
