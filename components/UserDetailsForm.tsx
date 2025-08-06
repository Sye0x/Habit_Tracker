import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, FlatList, ScrollView } from 'react-native';
import { RadioButton, Snackbar } from 'react-native-paper';

function UserDetailsForm() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [occupation, setOccupation] = useState("");
    const [gender, setGender] = useState("Male");
    const [frequency, setFrequency] = useState<string>("Daily");
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const frequencyList = [
        { label: "Daily", value: "Daily" },
        { label: "2-3 Days a week", value: "2-3 Days a week" },
        { label: "4-5 Days a week", value: "4-5 Days a week" }
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
            setSnackbarMessage(errors.join('\n'));
            setSnackbarVisible(true);
            return;
        }


        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("age", age);
        await AsyncStorage.setItem("occupation", occupation);
        await AsyncStorage.setItem("gender", gender);
        await AsyncStorage.setItem("frequency", frequency);
        await AsyncStorage.setItem("description", description);
        setSnackbarMessage("Form submitted successfully!");
        setSnackbarVisible(true);

        setName("");
        setAge("");
        setOccupation("");
        setGender("Male");
        setFrequency("Daily");
        setDescription("");
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.FormCard}>
                    <Text style={styles.headingText}>Tell Us About You!</Text>
                    <View style={styles.form}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={"#000"}
                            style={styles.inputfield}
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            placeholder='Age'
                            placeholderTextColor={"#000"}
                            style={styles.inputfield}
                            keyboardType="number-pad"
                            value={age}
                            onChangeText={setAge}
                        />
                        <TextInput
                            placeholder='Occupation'
                            placeholderTextColor={"#000"}
                            style={styles.inputfield}
                            value={occupation}
                            onChangeText={setOccupation}
                        />
                        <RadioButton.Group onValueChange={setGender} value={gender}>
                            <View style={{ flexDirection: "row" }}>
                                <RadioButton.Item label='Male' value='Male' />
                                <RadioButton.Item label='Female' value='Female' />
                            </View>
                        </RadioButton.Group>
                        <Text>How often do you practice a habit?</Text>
                        <TouchableOpacity
                            style={styles.customDropdown}
                            onPress={() => setShowModal(true)}
                        >
                            <Text>{frequency}</Text>
                        </TouchableOpacity>

                        <Text style={{ marginTop: 15 }}>Describe your habits in detail:</Text>
                        <TextInput
                            placeholder="E.g., I wake up at 6 AM, meditate for 10 minutes..."
                            placeholderTextColor={"#000"}
                            style={styles.multilineInput}
                            multiline={true}
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Submit</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={showModal}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setShowModal(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <FlatList
                                        data={frequencyList}
                                        keyExtractor={(item) => item.value}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => handleSelect(item.value)}
                                            >
                                                <Text>{item.label}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </ScrollView>

            {snackbarVisible && (
                <View style={styles.snackbarContainer}>
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={4000}
                        action={{
                            label: 'OK',
                            labelStyle: {
                                color: "#fff",
                                backgroundColor: "#bad9b4ff",
                                height: 40,
                                width: 40,
                                borderRadius: 20,
                                textAlign: "center",
                                textAlignVertical: "center", // Only works on Android
                                lineHeight: 40, // For vertical centering (iOS/web)
                            },
                            onPress: () => setSnackbarVisible(false),
                        }}
                        style={styles.snackbar}
                    >
                        {snackbarMessage.split('\n').map((msg, idx) => (
                            <Text key={idx} style={{ color: '#000', fontSize: 14, marginBottom: 20 }}>{msg}</Text>
                        ))}
                    </Snackbar>

                </View>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#bee1faff",
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    FormCard: {
        backgroundColor: "#e2d7d7ff",
        width: "85%",
        borderRadius: 15,
        elevation: 20,
        alignItems: "center",
        padding: 20
    },
    headingText: {
        color: "#84a17eff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    form: {
        width: "100%",
    },
    inputfield: {
        borderBottomColor: "#000",
        borderBottomWidth: 1,
        marginBottom: 10,
        paddingVertical: 8,
    },
    customDropdown: {
        height: 50,
        width: "100%",
        backgroundColor: "#e2d7d7ff",
        marginTop: 5,
        borderRadius: 5,
        justifyContent: "center",
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    multilineInput: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        marginTop: 10,
        backgroundColor: "#97ad92ff",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        elevation: 10
    },
    snackbarContainer: {
        position: 'absolute',
        top: "65%",
        left: 20,
        right: 20,
        zIndex: 100,

    },
    snackbar: {
        backgroundColor: "#ffb2b2ff",
        elevation: 30,
        borderRadius: 20,
        height: "90%",
        width: "95%"
    },
});

export default UserDetailsForm;