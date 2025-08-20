import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/rootReducer";
import auth from "@react-native-firebase/auth";


const lightTheme = {
    background: "#ffffff",
    containerBackground: "#ffffff",
    text: "#111",
    headingtext: "#abd1a3ff",
    border: "#b7b7b7ff",
    borderFocused: "#ffb888ff",
    placeholder: "#777",
    addButton: "#abd1a3ff",
    addButtonText: "#fff",
    iconColor: "#ffb888ff",
};

const darkTheme = {
    background: "#141414",
    containerBackground: "#141414",
    text: "#fff",
    headingtext: "#4f5bd5",
    border: "#444",
    borderFocused: "#4f5bd5",
    placeholder: "#888",
    addButton: "#4f5bd5",
    addButtonText: "#fff",
    iconColor: "#fff",
};

export default function ForgotPassword({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);

    const darkMode = useSelector((state: RootState) => state.theme);
    const theme = darkMode ? darkTheme : lightTheme;

    const validate = () => {
        let errors: { email?: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Invalid email format";
        }
        return errors;
    };

    const handlePasswordReset = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});


        auth().sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert("Success", "Password reset email sent successfully!");
                setEmail("");
                navigation.navigate("LogIn");
            })
            .catch((error) => {
                let message = "Something went wrong. Please try again.";
                if (error.code === "auth/user-not-found") {
                    message = "No account found with this email.";
                } else if (error.code === "auth/invalid-email") {
                    message = "Invalid email address.";
                }
                setErrors({ general: message });
            })
            .finally(() => setLoading(false));
    };

    return (
        <View style={[styles.Screen, { backgroundColor: theme.background, alignItems: "center" }]}>
            {/* Back Arrow */}
            <View style={{ alignItems: "flex-start", margin: hp(3), width: wp(90) }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={30} color={theme.iconColor} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                {/* Forgot Password Container */}
                <View style={[styles.container, { backgroundColor: theme.containerBackground }]}>
                    <Text style={[styles.headingText, { color: theme.headingtext }]}>Forgot Password</Text>
                    <Text style={{ color: theme.text, textAlign: "center", marginBottom: 20 }}>
                        Enter your email to receive a password reset link.
                    </Text>

                    {/* Email Input */}
                    <View
                        style={[
                            styles.inputContainer,
                            {
                                borderColor: focused === "email" ? theme.borderFocused : theme.border,
                                backgroundColor: theme.background,
                            },
                        ]}
                    >
                        <FontAwesome name="envelope" size={22} color={theme.iconColor} style={styles.icon} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

                    {/* Reset Button */}
                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: theme.addButton }]}
                        onPress={handlePasswordReset}
                        disabled={loading}
                    >
                        <Text style={[styles.resetButtonText, { color: theme.addButtonText }]}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Screen: { flex: 1 },
    container: {
        width: wp(90),
        borderRadius: 20,
        padding: 20,
        justifyContent: "center",
    },
    headingText: {
        fontSize: 30,
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
    resetButton: {
        marginTop: 15,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    resetButtonText: { fontSize: 18, fontWeight: "600" },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 5,
    },
});
