import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const lightTheme = {
    background: "#f2f8ff",
    containerBackground: "#ffffff",
    text: "#111",
    headingtext: "#abd1a3ff",   // updated
    border: "#b7b7b7ff",
    borderFocused: "#ffb888ff", // updated
    placeholder: "#777",
    addButton: "#abd1a3ff",     // updated
    addButtonText: "#fff",
    iconColor: "#ffb888ff"
};

const darkTheme = {
    background: "#2b2b2b",
    containerBackground: "#141414",
    text: "#fff",
    headingtext: "#4f5bd5",
    border: "#444",
    borderFocused: "#4f5bd5",
    placeholder: "#888",
    addButton: "#4f5bd5",
    addButtonText: "#fff",
    iconColor: "#fff"
};

export default function SignUp() {
    const [thememode, setTheme] = useState<boolean>(true);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [focused, setFocused] = useState<string | null>(null); // track which input is focused

    const theme = thememode ? lightTheme : darkTheme;

    const toggleTheme = () => {
        setTheme(!thememode);
    };

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            return;
        }
        console.log("Sign Up Data:", { username, email, password });
    };

    const handleLoginRedirect = () => {
        console.log("Navigate to Login Page");
    };

    type InputProps = {
        placeholder: string;
        value: string;
        onChangeText: (text: string) => void;
        secureTextEntry?: boolean;
        theme: typeof lightTheme | typeof darkTheme;
        focused: string | null;
        setFocused: (field: string | null) => void;
        fieldName: string;
    };

    const CustomInput: React.FC<InputProps> = ({
        placeholder,
        value,
        onChangeText,
        secureTextEntry = false,
        theme,
        focused,
        setFocused,
        fieldName
    }) => {
        return (
            <TextInput
                style={[
                    Styles.input,
                    {
                        borderColor: focused === fieldName ? theme.borderFocused : theme.border,
                        color: theme.text,
                        backgroundColor: theme.background,
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setFocused(fieldName)}
                onBlur={() => setFocused(null)}
            />
        );
    };


    return (
        <View style={[Styles.Screen, { backgroundColor: theme.background, alignItems: "center" }]}>
            {/* Theme Toggle */}
            <View style={{ alignItems: "flex-end", margin: hp(3), width: wp(90) }}>
                <TouchableOpacity onPress={toggleTheme}>
                    <FontAwesome name={thememode ? "sun-o" : "moon-o"} size={40} color={theme.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Sign Up Container */}
            <View style={[Styles.SignUpContainer, { backgroundColor: theme.containerBackground }]}>
                <Text style={[Styles.headingText, { color: theme.headingtext }]}>Sign Up</Text>

                {/* Username */}
                <CustomInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    theme={theme}
                    focused={focused}
                    setFocused={setFocused}
                    fieldName="username"
                />

                {/* Email */}
                <CustomInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    theme={theme}
                    focused={focused}
                    setFocused={setFocused}
                    fieldName="email"
                />

                {/* Password */}
                <CustomInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    theme={theme}
                    focused={focused}
                    setFocused={setFocused}
                    fieldName="password"
                />

                {/* Confirm Password */}
                <CustomInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    theme={theme}
                    focused={focused}
                    setFocused={setFocused}
                    fieldName="confirmPassword"
                />


                {/* Sign Up Button */}
                <TouchableOpacity style={[Styles.signUpButton, { backgroundColor: theme.addButton }]} onPress={handleSignUp}>
                    <Text style={[Styles.signUpButtonText, { color: theme.addButtonText }]}>Sign Up</Text>
                </TouchableOpacity>

                {/* Already have an account? */}
                <View style={Styles.loginRedirectContainer}>
                    <Text style={{ color: theme.text }}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleLoginRedirect}>
                        <Text style={[Styles.loginLink, { color: theme.headingtext }]}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    Screen: {
        flex: 1,
    },
    SignUpContainer: {
        width: wp(90),
        borderRadius: 20,
        padding: 20,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    headingText: {
        fontSize: 36,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        height: 55,
        borderWidth: 2.5,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
    },
    signUpButton: {
        marginTop: 10,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    signUpButtonText: {
        fontSize: 20,
        fontWeight: "600",
    },
    loginRedirectContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginLink: {
        fontSize: 16,
        fontWeight: "600",
    },
});
