import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { Snackbar } from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import type { RootState } from "./redux/rootReducer";

type UserDetailsFormProps = {
    route: RouteProp<RootStackParamList, "UserDetailsForm">;
    navigation: any;
};

// Light & Dark Themes
const lightTheme = {
    background: "#ffffff",
    containerBackground: "#ffffff",
    text: "#111",
    headingtext: "#4f5bd5",
    border: "#b7b7b7ff",
    borderFocused: "#4f5bd5",
    placeholder: "#777",
    addButton: "#4f5bd5",
    addButtonText: "#fff",
    iconColor: "#4f5bd5",
    modalBackground: "#fff",
    modalText: "#111",
};

const darkTheme = {
    background: "#141414",
    containerBackground: "#1e1e1e",
    text: "#fff",
    headingtext: "#4f5bd5",
    border: "#444",
    borderFocused: "#4f5bd5",
    placeholder: "#aaa",
    addButton: "#4f5bd5",
    addButtonText: "#fff",
    iconColor: "#fff",
    modalBackground: "#2b2b2b",
    modalText: "#fff",
};

const UserDetailsForm = ({ route, navigation }: UserDetailsFormProps) => {
    const { uid } = route.params;

    const darkMode = useSelector((state: RootState) => state.theme);
    const theme = darkMode ? darkTheme : lightTheme;

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [occupation, setOccupation] = useState("");
    const [gender, setGender] = useState("Male");
    const [frequency, setFrequency] = useState<string>("Daily");
    const [description, setDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [focused, setFocused] = useState<string | null>(null);

    const frequencyList = [
        { label: "Daily", value: "Daily" },
        { label: "Weekly", value: "Weekly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Occasionally", value: "Occasionally" },
    ];

    const handleSelect = (item: string) => {
        setFrequency(item);
        setShowModal(false);
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedOccupation = occupation.trim();
        const numericAge = Number(age);
        const trimmedDescription = description.trim();
        const errors: string[] = [];

        if (trimmedName.length < 3) errors.push("Name must be at least 3 characters long.");
        if (!age || isNaN(numericAge) || numericAge < 4) errors.push("Age must be greater than 4.");
        if (trimmedOccupation.length < 2) errors.push("Please enter a valid occupation.");
        if (trimmedDescription.length === 0) errors.push("Please describe your habits.");

        if (errors.length > 0) {
            setSnackbarMessage(errors.join("\n"));
            setSnackbarVisible(true);
            return;
        }

        try {
            setLoading(true);

            await AsyncStorage.multiSet([
                ["name", name],
                ["age", age],
                ["occupation", occupation],
                ["gender", gender],
                ["frequency", frequency],
                ["description", description],
            ]);

            await firestore()
                .collection("users")
                .doc(uid)
                .set(
                    {
                        name,
                        age,
                        occupation,
                        gender,
                        frequency,
                        description,
                    },
                    { merge: true }
                );

            setSnackbarMessage("Form submitted successfully!");
            setSnackbarVisible(true);

            setName("");
            setAge("");
            setOccupation("");
            setGender("Male");
            setFrequency("Daily");
            setDescription("");

            navigation.navigate("LogIn");
        } catch (error: any) {
            setSnackbarMessage("Error: " + error.message);
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.screen, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.containerBackground }]}>
                <Text style={[styles.headingText, { color: theme.headingtext }]}>
                    Tell Us About You!
                </Text>

                {/* Name */}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            borderColor: focused === "name" ? theme.borderFocused : theme.border,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    <FontAwesome name="user" size={22} color={theme.iconColor} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Enter your name"
                        placeholderTextColor={theme.placeholder}
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                    />
                </View>

                {/* Age */}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            borderColor: focused === "age" ? theme.borderFocused : theme.border,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    <FontAwesome name="calendar" size={22} color={theme.iconColor} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Enter your age"
                        placeholderTextColor={theme.placeholder}
                        keyboardType="number-pad"
                        value={age}
                        onChangeText={setAge}
                        onFocus={() => setFocused("age")}
                        onBlur={() => setFocused(null)}
                    />
                </View>

                {/* Occupation */}
                <View
                    style={[
                        styles.inputContainer,
                        {
                            borderColor: focused === "occupation" ? theme.borderFocused : theme.border,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    <FontAwesome name="briefcase" size={22} color={theme.iconColor} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="Enter your occupation"
                        placeholderTextColor={theme.placeholder}
                        value={occupation}
                        onChangeText={setOccupation}
                        onFocus={() => setFocused("occupation")}
                        onBlur={() => setFocused(null)}
                    />
                </View>

                {/* Custom Gender Radio Buttons */}
                <Text style={[styles.label, { color: theme.text }]}>Select Gender</Text>
                <View style={styles.genderContainer}>
                    {["Male", "Female"].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.genderOption}
                            onPress={() => setGender(option)}
                        >
                            <View
                                style={[
                                    styles.radioOuter,
                                    {
                                        borderColor:
                                            gender === option ? theme.borderFocused : theme.border,
                                    },
                                ]}
                            >
                                {gender === option && (
                                    <View
                                        style={[
                                            styles.radioInner,
                                            { backgroundColor: theme.borderFocused },
                                        ]}
                                    />
                                )}
                            </View>
                            <Text style={[styles.genderText, { color: theme.text }]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Frequency Dropdown */}
                <Text style={[styles.label, { color: theme.text }]}>How often do you practice a habit?</Text>
                <TouchableOpacity
                    style={[styles.dropdown, { borderColor: theme.border }]}
                    onPress={() => setShowModal(true)}
                >
                    <Text style={{ color: theme.text }}>{frequency}</Text>
                </TouchableOpacity>

                {/* Description */}
                <Text style={[styles.label, { color: theme.text }]}>Describe your habits:</Text>
                <TextInput
                    style={[
                        styles.multilineInput,
                        { borderColor: theme.border, color: theme.text, backgroundColor: theme.background },
                    ]}
                    placeholder="E.g., I wake up at 6 AM, meditate for 10 minutes..."
                    placeholderTextColor={theme.placeholder}
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.addButton }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={[styles.submitButtonText, { color: theme.addButtonText }]}>
                        {loading ? "Saving..." : "Submit"}
                    </Text>
                </TouchableOpacity>

                {/* Frequency Modal */}
                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}>
                            <Text style={[styles.modalTitle, { color: theme.modalText }]}>
                                Select Frequency
                            </Text>
                            <FlatList
                                data={frequencyList}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleSelect(item.value)}
                                    >
                                        <Text style={{ color: theme.modalText }}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={[styles.closeButton, { backgroundColor: theme.addButton }]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={[styles.closeButtonText, { color: theme.addButtonText }]}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Snackbar */}
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={4000}
                    style={styles.snackbar}
                >
                    {snackbarMessage}
                </Snackbar>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1 },
    container: {
        margin: 20,
        padding: 20,
        borderRadius: 15,
        elevation: 5,
    },
    headingText: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 55,
    },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 18 },
    label: { fontSize: 16, marginVertical: 5 },
    genderContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    genderOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    genderText: {
        marginLeft: 8,
        fontSize: 16,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        justifyContent: "center",
        marginBottom: 10,
    },
    multilineInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        height: 100,
        textAlignVertical: "top",
        marginBottom: 15,
    },
    submitButton: {
        marginTop: 15,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    submitButtonText: { fontSize: 18, fontWeight: "600" },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: "100%",
        alignItems: "center",
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    closeButtonText: { fontSize: 16, fontWeight: "600" },
    snackbar: {
        backgroundColor: "#ffb2b2ff",
        elevation: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        bottom: 30,
        position: "absolute",
    },
});

export default UserDetailsForm;
